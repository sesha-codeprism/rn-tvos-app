import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { useQueries } from "react-query";
import { ConflictResolutionContext } from "../../../../contexts/conflictResolutionContext";
import { findConflictedGroupBySeriesOrProgramId, getScheduledItems } from "../../../../utils/ConflictUtils";
import {  getConflicts } from "../../../../../backend/dvrproxy/dvrproxy";
import { defaultQueryOptions } from "../../../../config/constants";
import ConflictResolutionNormal from "./ConflictResolutionNomal";
import ConflictResolutionEpisodes from "./ConflictResolutionEpisodes";
import ConflictResolutionTimeOverlap from "./ConflictResolutionTimeOverlap";
import MFLoader from "../../../../components/MFLoader";
import MFEventEmitter from "../../../../utils/MFEventEmitter";
import { AppStrings } from "../../../../config/strings";



interface Props {
  navigation?: NativeStackNavigationProp<any>;
  route?: any;
  allSubscriptions?:any;
}

enum ViewType {
  None,
  Normal,
  Episodes,
  TimeOverlap
}

const ConflictResolution: React.FunctionComponent<Props> = (props: Props) => {
  const conflictContext = useContext(ConflictResolutionContext);

  const [timeOverlapConflictIndex, setTimeOverlapConflictIndex] = useState(0); 
  const [viewState, setViewState] = useState([ViewType.None]);

  const [itemsInConflict, setItemsInConflict] = useState(undefined);
  
  const [doesConflictExists, setDoesConflictExists] = useState(true); // default assumed to be true, since we came from a click of Resolve Conflict button from UDP
  
  const [viewData, setViewData] = useState<any>([{
    [ViewType.None]: undefined,
    [ViewType.Normal]: undefined,
    [ViewType.Episodes]: undefined,
    [ViewType.TimeOverlap]: undefined,
  }]);
  const [scheduleItemsAll, setAllScheduledItems] = useState<any[]>([]);

  const goBack = (params? : any) => {
    if(!params || viewState.length === 2){
      setViewData(viewData.slice(0, -1));
      setViewState(viewState.slice(0, -1));
      if (viewState.length === 2) {
        MFEventEmitter.emit("closeConflictResolution", undefined);
      }
    }else {
      const resolvedConflict = params.resolved?.SubscriptionItemId;
      const timeOverlapConflictIndex = params.timeOverlapConflictIndex;
      const lastViewData = viewData[viewData.length - 2][viewState[viewState.length -  2]];
      if(viewState[viewState.length -  2] ===  ViewType.Episodes){
        // remove the resolved episode from lastViewData
        const filteredEpisodes = lastViewData.filter((si: any) => si !== resolvedConflict);
        // if more episdoes left
        if(filteredEpisodes.length){
          // update the state
          const newViewData = [...viewData];
          newViewData[viewData.length - 2] = {
            ...newViewData[viewData.length - 2],
            [ViewType.Episodes] : filteredEpisodes
          }
          newViewData.pop();
          setViewData(newViewData);
          setViewState(viewState.slice(0, -1));
        }else {
          // if no more episodes left, pop two times
          const newViewData = [...viewData];
          newViewData.pop();
          newViewData.pop();
          const newViewState = [...viewState];
          newViewState.pop();
          newViewState.pop();
          // if only one remaining, that means no view, close the panel, all resolved
          if(newViewState.length === 1){
            MFEventEmitter.emit("closeConflictResolution", undefined);
          }else{
            setViewData(newViewData);
            setViewState(newViewState);
          }
        }
      }else if(viewState[viewState.length -  2] ===  ViewType.TimeOverlap){
        // mark the resolved conflict  in lastViewData
        const newTimeOverlapState = lastViewData.map((group: any, index: number) => {
          // if group.Items contains resolvedConflict, mark it resolved
          if(timeOverlapConflictIndex === index){
            return {
              ...group,
              resolved: true
            }
          }else{
            return group;
          }
        });
        const newViewData = [...viewData];
        const newViewState = [...viewState];
        // check to see if all is marked resolved, then pop one more time
        if(newTimeOverlapState.every((timeOverlap:any) => timeOverlap.resolved)){
          newViewData.pop();
          newViewData.pop();
          newViewState.pop();
          newViewState.pop();
          if(newViewState.length === 1){
            MFEventEmitter.emit("closeConflictResolution", undefined);
          }else{
            setViewData(newViewData);
            setViewState(newViewState);
          }
        }else{
          newViewData[newViewData.length - 2] = {
            ...newViewData[newViewData.length - 2],
            [ViewType.TimeOverlap]: newTimeOverlapState
          }
          newViewData.pop();
          setViewData(newViewData);
          setViewState(viewState.slice(0, -1));
        }
      }
    }
  }



  const allConflictsResults = useQueries((itemsInConflict || []).map((conflict: any) => {
                                                            return {
                                                              queryKey: ['Conflicts',conflict],
                                                              queryFn: () => getConflicts(conflict),
                                                              staleTime: defaultQueryOptions.staleTime, cacheTime: defaultQueryOptions.cacheTime,
                                                              enabled: !!conflict
                                                            };
                                                        }));




  useEffect(() =>{
    // used to recalculate after reload of subscription group, set the conflicted items accodingly
    if(props.allSubscriptions && props.allSubscriptions?.SubscriptionGroups){
      const allScheduledItems =  getScheduledItems( props.allSubscriptions?.SubscriptionGroups);
      allScheduledItems && allScheduledItems.length && setAllScheduledItems(allScheduledItems);
      const conflictedSubscriptionGroup: any|undefined = findConflictedGroupBySeriesOrProgramId(conflictContext.SeriesId || conflictContext.ProgramId, props.allSubscriptions?.SubscriptionGroups);
      const conflictedItems = conflictedSubscriptionGroup?.[0]?.SubscriptionItems?.filter((si: any) =>  si.ItemState  === 'Conflicts');
      if(conflictedSubscriptionGroup && conflictedItems && conflictedItems.length){
        setItemsInConflict(conflictedItems.map((si: any) => si.Id));
      }else {
        // no conflict, exit panel
        setDoesConflictExists(false);
      }
    }
  }, [props.allSubscriptions]);


  let isAllCoflictsLoaded = false;
  if(itemsInConflict?.length){
    isAllCoflictsLoaded = allConflictsResults.every((q:any) => 
     q.status === 'success' && !q.isLoading && !q.isFetching && !q.isStale
    );
    if(isAllCoflictsLoaded){
      if(allConflictsResults?.length === itemsInConflict.length){
        if(allConflictsResults.every((conflictsQ: any) => conflictsQ?.data?.data?.length === 0)){
         //goBack();
        }
      }
    }
  }

  useEffect(() => {
  // used to recalculate after load of conflicetd items, set the sub view accordingly
    if(isAllCoflictsLoaded){
        if(itemsInConflict?.length && allConflictsResults?.length === itemsInConflict?.length){
            if(itemsInConflict?.length === 1 && allConflictsResults?.[0]?.data?.data?.length === 1){  
              const currentConflicts = allConflictsResults?.[0]?.data?.data;
              if(currentConflicts && currentConflicts.length){
                const viewConflicts = currentConflicts?.[0]?.Items?.filter((fn:any) => (fn.State !== 'Conflicts' || (fn.State === 'Conflicts' && fn.Priority === 1))).map((cnf: any) => {
                  return {
                    SubscriptionItemId: cnf?.SubscriptionItemId,
                    discardCandidate: cnf?.State === 'Conflicts' && cnf?.Priority === 1 
                  }
                });
                setViewData([
                  ...viewData,
                  {
                    ...viewData[viewData.length - 1],
                    [ViewType.Normal]:viewConflicts
                  }
                ]);
                setViewState([...viewState, ViewType.Normal]);
              }
            }else if(itemsInConflict.length === 1 && allConflictsResults?.[0]?.data?.data?.length  > 1){
              
              const currentConflicts = allConflictsResults?.[0]?.data?.data;
              // filter out empty stuffs
              const filteredConflicts = currentConflicts.filter((timeOverlap: any) => {
                return !!timeOverlap.Items.length;
              });
              if(filteredConflicts.length === 1){ // if only 1 is valid then it is Normal
                const viewConflicts = filteredConflicts?.[0]?.Items?.filter((fn:any) => (fn.State !== 'Conflicts' || (fn.State === 'Conflicts' && fn.Priority === 1))).map((cnf: any) => {
                  return {
                    SubscriptionItemId: cnf?.SubscriptionItemId,
                    discardCandidate: cnf?.State === 'Conflicts' && cnf?.Priority === 1 
                  }
                });
                setViewData([
                  ...viewData,
                  {
                    ...viewData[viewData.length - 1],
                    [ViewType.Normal]:viewConflicts
                  }
                ]);
                setViewState([...viewState, ViewType.Normal]);
              }else {
                setViewData([
                  ...viewData,
                  {
                    ...viewData[viewData.length - 1],
                    [ViewType.TimeOverlap]:filteredConflicts // sanitize  later if required
                  }
                ]); 
                setViewState([...viewState, ViewType.TimeOverlap]);
              }
            }else if(itemsInConflict.length > 1){
              setViewState([...viewState, ViewType.Episodes]);
              // filter out empty ones
              const  fileredConflicts = itemsInConflict?.filter((conflict: string) => {
                const episodeConflicts = (allConflictsResults || []).find((query: any) => {
                  const config = query?.data?.config;
                  return config.url.includes(conflict)
                });
                return !!episodeConflicts?.data?.data.length
              })

              setViewData([
                ...viewData,
                {
                  ...viewData[viewData.length - 1],
                  [ViewType.Episodes]:fileredConflicts
                }
              ]); 
            }else{
              setTimeout(() => {
                MFEventEmitter.emit("openPopup", {
                  buttons: [
                    {
                      title: "OK",
                      onPress: async () => {
                        MFEventEmitter.emit("closeAll", undefined);
                        
                      },
                    }
                  ],
                  description: AppStrings?.str_dvr_no_conflict_exists
                });
                
              }, 1000);
            }

        }
    }
  },  [isAllCoflictsLoaded])


  useEffect(()  => {
    if(!doesConflictExists){
      // exit the panel
      MFEventEmitter.emit("closeConflictResolution", undefined);
    }
  }, [doesConflictExists]);



  const moveToEpisode = (conflict: any) => {
    const episodeConflicts = (allConflictsResults || []).find((query: any) => {
      const config = query?.data?.config;
      return config.url.includes(conflict)
    });
    // decide if timeOverlap or Normal,
    // not sure if epsiodes within episodes, required, revisit later
    if (episodeConflicts?.data?.data?.length > 1) {
      // timeOverlap
      setViewData([
        ...viewData,
        {
          ...viewData[viewData.length - 1],
          [ViewType.TimeOverlap]: episodeConflicts?.data?.data // sanitize  later if required
        }
      ]);
      setViewState([...viewState, ViewType.TimeOverlap]);
    } else if (episodeConflicts?.data?.data?.length === 1) {
      // normal
      setViewData([
        ...viewData,
        {
          ...viewData[viewData.length - 1],
          [ViewType.Normal]: episodeConflicts?.data?.data?.[0]?.Items?.filter((fn: any) => (fn.State !== 'Conflicts' || fn.State =='Conflicts' && fn.Priority === 1)).map((cnf: any) => {
            return {
              SubscriptionItemId: cnf?.SubscriptionItemId,
              discardCandidate: cnf?.State === 'Conflicts' && cnf?.Priority === 1
            }
          })
        }
      ]);
      setViewState([...viewState, ViewType.Normal]);
    }
  }

  const moveToTimeOverlap = (conflictIndex: number) => {

    const currentConflicts = viewData[viewData.length- 1][ViewType.TimeOverlap][conflictIndex];
    // normal
    setViewData([
      ...viewData,
      {
        ...viewData[viewData.length - 1],
        [ViewType.Normal]: currentConflicts?.Items?.filter((fn: any) => (fn.State !== 'Conflicts' || fn.State =='Conflicts' && fn.Priority === 1)).map((cnf: any) => {
          return {
            SubscriptionItemId: cnf?.SubscriptionItemId,
            discardCandidate: cnf?.State === 'Conflicts' && cnf?.Priority === 1
          }
        })
      }
    ]);
    setViewState([...viewState, ViewType.Normal]);
    setTimeOverlapConflictIndex(conflictIndex);
  }


  const s = getScheduledItems(props.allSubscriptions?.SubscriptionGroups);
  if (viewState[viewState.length - 1] === ViewType.Normal && viewData[viewData.length - 1][ViewType.Normal]) {
    return (
      <ConflictResolutionNormal viewData={viewData[viewData.length - 1][ViewType.Normal]} scheduleItemsAll={s} allSgRefetch={() => { }} goBack={goBack} timeOverlapConflictIndex={timeOverlapConflictIndex} />
    )
  }
  if (viewState[viewState.length - 1] === ViewType.Episodes && viewData[viewData.length - 1][ViewType.Episodes]) {
    return (
      <ConflictResolutionEpisodes viewData={viewData[viewData.length - 1][ViewType.Episodes]} scheduleItemsAll={s} moveToEpisode={moveToEpisode} goBack={goBack} />
    )
  }
  if (viewState[viewState.length - 1] === ViewType.TimeOverlap && viewData[viewData.length - 1][ViewType.TimeOverlap]) {
    return (
      <ConflictResolutionTimeOverlap viewData={viewData[viewData.length - 1][ViewType.TimeOverlap]} scheduleItemsAll={s} allSgRefetch={() => { }} goBack={goBack} moveToTimeOverlap={moveToTimeOverlap} />
    )
  }

  return (
    <MFLoader />
  )
};

export default ConflictResolution;

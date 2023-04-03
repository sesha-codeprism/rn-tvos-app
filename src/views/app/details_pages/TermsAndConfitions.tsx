import React from "react";
import { StyleSheet, View, TVTextScrollView, Text } from "react-native";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { scaleAttributes, getUIdef } from "../../../utils/uidefinition";
import { globalStyles } from "../../../config/styles/GlobalStyles";


type TermsAndConditionsPanelProps = {
        params: {
            title: string;
            subTitle: string;
            terms: string;
        };
    };


const TermsAndConditionsPanelImpl: React.FunctionComponent<TermsAndConditionsPanelProps> = (props: TermsAndConditionsPanelProps) => {
    const invertedHeading = true;

    const headingLine1 = props.route.params?.title;

    const headingLine2 = props.route.params?.subTitle;

    const renderBody= () => {
        const { terms } = props.route.params;
        return (
                <View style={styles.container}>
                    <View style={styles.label}>
                        <TVTextScrollView snapToStart={true}>
                            <Text style={styles.text}>{terms}</Text>
                        </TVTextScrollView>
                    </View>
                </View>
        );
    }

    return (
        <SideMenuLayout
            title={headingLine1}
            subTitle={headingLine2}
            isTitleInverted={invertedHeading}
        >
            {renderBody()}
        </SideMenuLayout>
    )
}



export const TermsAndConditions = TermsAndConditionsPanelImpl

//  getUIdef("Settings.FossLisence")?.style ||
const styles = StyleSheet.create(
        scaleAttributes({
            container: {
                flexGrow: 1,
                paddingBottom: 30,
            },
            label: {
                fontSize: 16,
                marginTop: 36,
                padding: 35,
                marginBottom: 164,
                fontFamily: globalStyles.fontFamily.regular,
            },
            text: {
                fontSize: 25,
                fontFamily: globalStyles.fontFamily.regular,
                color: globalStyles.fontColors.light
            }
        })
);

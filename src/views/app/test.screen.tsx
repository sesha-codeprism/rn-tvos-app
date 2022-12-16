import React from 'react'
import { Dimensions } from 'react-native'
import Search from '../../components/MFSearch'

type Props = {}

export default function TestScreen({}: Props) {
  return (
    <Search style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').height, backgroundColor: 'red'}}/>
  )
}
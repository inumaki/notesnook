import React, {useEffect, useRef, useState} from 'react';
import {Linking, Platform, View} from 'react-native';
import {eSubscribeEvent, eUnSubscribeEvent} from '../../services/EventManager';
import {eCloseRateDialog, eOpenRateDialog} from '../../utils/Events';
import {MMKV} from '../../utils/mmkv';
import {SIZE} from '../../utils/SizeUtils';
import ActionSheetWrapper from '../ActionSheetComponent/ActionSheetWrapper';
import {Button} from '../Button';
import Seperator from '../Seperator';
import Heading from '../Typography/Heading';
import Paragraph from '../Typography/Paragraph';

const RateDialog = () => {
  const [visible, setVisible] = useState(false);
  const actionSheetRef = useRef();

  useEffect(() => {
    eSubscribeEvent(eOpenRateDialog, open);
    eSubscribeEvent(eCloseRateDialog, close);
    return () => {
      eUnSubscribeEvent(eOpenRateDialog, open);
      eUnSubscribeEvent(eCloseRateDialog, close);
    };
  }, []);

  const open = () => {
    setVisible(true);
  };
  useEffect(() => {
    if (visible) {
      actionSheetRef.current?.show();
    }
  }, [visible]);

  const close = () => {
    actionSheetRef.current?.hide();
  };

  return !visible ? null : (
    <ActionSheetWrapper
      centered={false}
      fwdRef={actionSheetRef}
      onClose={async () => {
        await MMKV.setItem(
          'askForRating',
          JSON.stringify({
            timestamp: Date.now() + 86400000 * 2
          })
        );
        setVisible(false);
      }}>
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: 12
        }}>
        <Heading>Do you enjoy using Notesnook?</Heading>
        <Paragraph size={SIZE.md}>
          It took us a year to bring Notesnook to life. Share your experience
          and suggestions to help us improve it.
        </Paragraph>

        <Seperator half />
        <Button
          onPress={async () => {
            await Linking.openURL(
              Platform.OS === 'ios'
                ? 'https://bit.ly/notesnook-ios'
                : 'https://bit.ly/notesnook-and'
            );

            await MMKV.setItem('askForRating', 'completed');
            setVisible(false);
          }}
          fontSize={SIZE.md}
          width="100%"
          height={50}
          type="accent"
          title="Rate now (It takes only a second)"
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingTop: 12,
            width: '100%',
            alignSelf: 'center'
          }}>
          <Button
            onPress={async () => {
              await MMKV.setItem('askForRating', 'never');
              setVisible(false);
            }}
            fontSize={SIZE.md}
            type="error"
            width="48%"
            height={50}
            title="Never"
          />
          <Button
            onPress={async () => {
              await MMKV.setItem(
                'askForRating',
                JSON.stringify({
                  timestamp: Date.now() + 86400000 * 2
                })
              );
              setVisible(false);
            }}
            fontSize={SIZE.md}
            width="48%"
            height={50}
            type="grayBg"
            title="Later"
          />
        </View>
      </View>
    </ActionSheetWrapper>
  );
};

export default RateDialog;

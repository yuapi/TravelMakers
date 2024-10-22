import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";

declare global {
  interface Date {
    format(f: string): string;
  }
  interface String {
    string(l: number): string;
    zf(l: number): string;
  }
  interface Number {
    zf(l: number): string;
  }
}


Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    let h = null;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1: string): string {
        switch ($1) {
            case "yyyy": return d.getFullYear().toString();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        } 
    });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

export default function QtwoScreen() {
  const [isDeparturePickerVisible, setDeparturePickerVisibility] = useState(false);
  const [isArrivalPickerVisible, setArrivalPickerVisibility] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const showDeparturePicker = () => {
    setDeparturePickerVisibility(true);
  };

  const showArrivalPicker = () => {
      setArrivalPickerVisibility(true);
  };

  const hideDeparturePicker = () => {
      setDeparturePickerVisibility(false);
  };

  const hideArrivalPicker = () => {
      setArrivalPickerVisibility(false);
  };

  const handleDepartureConfirm = (date: Date) => {
      setDepartureDate(date.format("yyyy/MM/dd"));
      hideDeparturePicker();
  };

  const handleArrivalConfirm = (date: Date) => {
    if (date < new Date(departureDate.replace(/\//g, '-'))) {
        Alert.alert('알림','도착일은 출발일 이후로 선택해주세요.');
        hideArrivalPicker();
    } else {
        setArrivalDate(date.format("yyyy/MM/dd"));
        hideArrivalPicker();
    }
  };

  return (
    <View style={styles.container}>      
      <Text style={styles.HomeText}>여행 날짜 선택</Text>
      <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>출발일</Text>
              <TouchableOpacity onPress={showDeparturePicker}>
                  <TextInput
                      pointerEvents="none"
                      style={styles.textInput}
                      placeholder="출발일을 선택해주세요"
                      placeholderTextColor='#000000'
                      underlineColorAndroid="transparent"
                      editable={false}
                      value={departureDate}
                  />
                  <DateTimePickerModal
                      // headerTextIOS="출발일"
                      isVisible={isDeparturePickerVisible}
                      mode="date"
                      onConfirm={handleDepartureConfirm}
                      onCancel={hideDeparturePicker}
                  />
              </TouchableOpacity>
          </View>

          <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>도착일</Text>
              <TouchableOpacity onPress={showArrivalPicker}>
                  <TextInput
                      pointerEvents="none"
                      style={styles.textInput}
                      placeholder="도착일을 선택해주세요"
                      placeholderTextColor='#000000'
                      underlineColorAndroid="transparent"
                      editable={false}
                      value={arrivalDate}
                  />
                  <DateTimePickerModal
                      // headerTextIOS="도착일"
                      isVisible={isArrivalPickerVisible}
                      mode="date"
                      onConfirm={handleArrivalConfirm}
                      onCancel={hideArrivalPicker}
                  />
              </TouchableOpacity>
          </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.NextBottom}>
          <Link href='/recommendation'>
            <Text style={styles.BottomText}>확인</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HomeText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 50,
      marginTop:50
  },
  dateInputContainer: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10
  },
  NextBottom: {
    backgroundColor: "skyblue",
    padding: 10,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
  },
  BottomText: {
    fontSize: 15,
    color: 'white',
    textAlign: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
})
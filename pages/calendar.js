import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Swiper from 'react-native-swiper';
import NavigationMenu6 from '../components/NavigationMenu6';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

export default function ScheduleApp({ navigation }) {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [activity, setActivity] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');
    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const handleSchedule = () => {
    const dateKey = value.toDateString();
    const newEvent = {
      startTime,
      endTime,
      activity,
      selectedCompany,
    };
    setEvents(prevEvents => {
      const dateEvents = prevEvents[dateKey] || [];
      return {
        ...prevEvents,
        [dateKey]: [...dateEvents, newEvent],
      };
    });
    setShowTaskForm(false);
  };

  const addTask = () => {
    setShowTaskForm(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Schedule</Text>
      </View>

      <View style={styles.picker}>
        <Swiper
          index={1}
          ref={swiper}
          loop={false}
          showsPagination={false}
          onIndexChanged={ind => {
            if (ind === 1) {
              return;
            }
            setTimeout(() => {
              const newIndex = ind - 1;
              const newWeek = week + newIndex;
              setWeek(newWeek);
              setValue(moment(value).add(newIndex, 'week').toDate());
              swiper.current.scrollTo(1, false);
            }, 100);
          }}
        >
          {weeks.map((dates, index) => (
            <View style={styles.itemRow} key={index}>
              {dates.map((item, dateIndex) => {
                const isActive =
                  value.toDateString() === item.date.toDateString();
                return (
                  <TouchableWithoutFeedback
                    key={dateIndex}
                    onPress={() => {
                      setValue(item.date);
                      setShowTaskForm(true);
                    }}
                  >
                    <View
                      style={[
                        styles.item,
                        isActive && {
                          backgroundColor: '#111',
                          borderColor: '#111',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.itemWeekday,
                          isActive && { color: '#fff' },
                        ]}
                      >
                        {item.weekday}
                      </Text>
                      <Text
                        style={[
                          styles.itemDate,
                          isActive && { color: '#fff' },
                        ]}
                      >
                        {item.date.getDate()}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          ))}
        </Swiper>
      </View>

      {!showTaskForm && (
        <View style={{ alignItems: 'center' }}>
          <ScrollView style={styles.eventsList}>
            {events[value.toDateString()]?.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <Text style={styles.eventText}>
                  {event.activity} - {moment(event.startTime).format('HH:mm')} to {moment(event.endTime).format('HH:mm')} ({event.selectedCompany})
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={{ alignItems: 'center', transform: [{ translateY: height * .821 }] }}>
            <NavigationMenu6 navigation={navigation} addTask={addTask} />
          </View>
        </View>
      )}

      {showTaskForm && (
        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
          <Text style={styles.subtitle}>{value.toDateString()}</Text>
          <View style={styles.form}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={styles.label}>Start Time</Text>
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, date) => setStartTime(date || startTime)}
                themeVariant='light'
              />
            </View>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={styles.label}>End Time</Text>
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, date) => setEndTime(date || endTime)}
                themeVariant='light'
              />
            </View>
            <Text style={styles.label}>Activity</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter activity description"
              value={activity}
              onChangeText={setActivity}
            />
            <Text style={styles.label}>Company</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
              <Text style={{ color: '#fff' }}>{selectedCompany ? selectedCompany : "Select a company"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSchedule}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Schedule</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTaskForm(false)}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Go Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { alignItems: 'center', justifyContent: 'center', alignContent: 'center' }]}>
          <View style={styles.modalView}>
            <Picker
              selectedValue={selectedCompany}
              style={styles.pickerDropdown}
              onValueChange={(itemValue) => setSelectedCompany(itemValue)}
            >
              <Picker.Item label="Select a company" value="" />
              <Picker.Item label="Company A" value="Company A" />
              <Picker.Item label="Company B" value="Company B" />
              <Picker.Item label="Company C" value="Company C" />
            </Picker>

          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingVertical: 24,
    backgroundColor: '#2c3e50',
    width: width,
    height: height
  },
  header: {
    paddingHorizontal: 16,
    marginTop: 15
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    justifyContent: 'center',
    width: '100%'
  },
  btn: {
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  addButton: {
    height: 50,
    backgroundColor: '#3498db', // Match button color with Login screen
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  eventsList: {
    paddingHorizontal: 16,
  },
  eventItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#e3e3e3',
    borderWidth: 1,
  },
  eventText: {
    fontSize: 16,
    color: '#1d1d1d',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    //height: 250,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: '80%',
    maxWidth: '80%',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '80%'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
});


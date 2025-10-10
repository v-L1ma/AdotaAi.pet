import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

export type SelectOption = {
  label: string;
  value: string | number;
};

type Props = {
  options: SelectOption[];
  selected: SelectOption | null;
  onSelect: (item: SelectOption) => void;
  placeholder?: string;
};

export const SelectInput: React.FC<Props> = ({
  options,
  selected,
  onSelect,
  placeholder = 'Selecione uma opção',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: SelectOption) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={{width:"100%", borderRadius:40, display:"flex", overflow:"hidden",margin:10}}>
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: selected ? '#3d0c00ff' : '#000000ff' }}>
          {selected ? selected.label : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={(e: GestureResponderEvent) => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectBox: {
    borderColor: '#999',
    backgroundColor:"white",
    padding: 12,
    borderRadius: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 6,
    maxHeight: '50%',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Header } from "native-base";
import { StyleSheet, Dimensions, View, Text, Modal, TouchableHighlight } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import { district, buildCoordinate } from "../assets/coordinates/index";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as geolib from "geolib";
import * as Location from "expo-location";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default function Page1({ navigation: { navigate } }) {
  const navigation = useNavigation();
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchData, setFetchData] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [modalAlert, setModalAlert] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get(`https://crimeport-orchestrator.herokuapp.com/districts`)
      .then((res) => {
        setFetchData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const finalData = [];
    if (fetchData) {
      for (let i = 0; i < district.length; i++) {
        let districtData = {
          name: null,
          cords: buildCoordinate(district[i]),
          status: null,
        };
        for (let j = 0; j < fetchData.length; j++) {
          if (fetchData[j].mapName == district[i]) {
            districtData.name = fetchData[j].name;
            districtData.status = fetchData[j].status;
          }
        }
        finalData.push(districtData);
      }
      setDataKecamatan(finalData);
    }
  }, [fetchData]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      } else {
        function success(pos) {
          var crd = pos.coords;
          setLocation(crd);
        }

        function error(err) {
          console.warn("ERROR(" + err.code + "): " + err.message);
        }

        const options = {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 5000,
        };

        navigator.geolocation.watchPosition(success, error, options);
      }
    })();
  }, []);

  useEffect(() => {
    dataKecamatan.forEach((data) => {
      if (geolib.isPointInPolygon({ latitude: location.latitude, longitude: location.longitude }, data.cords)) {
        if (data.status === "dangerous") {
          setStatus("Danger! You are in a danger area. Please read our dos and don'ts to make yourself safer.");
        } else if (data.status === "warning") {
          setStatus(
            "Warning! You are in a warning area. You are prone to become a victim of criminal act. Please read our dos and don'ts to make yourself safer."
          );
        } else {
          setStatus(
            "Safe! You are in a safe area. Please enjoy your stay and read our dos and don'ts to make yourself safer."
          );
        }
        setTimeout(() => {
          setModalAlert(true);
        }, 2000);
      }
    });
  }, [location]);

  const showModal = (value) => {
    let dataGrab = fetchData.filter(function (element) {
      return element.name === value.name;
    });
    if (dataGrab.length) {
      setDataModal(dataGrab[0]);
      setModalVisible(true);
    }
  };

  const changePage = () => {
    navigation.navigate("Do");
    setModalAlert(false);
  };

  // RENDER PAGE
  if (location.latitude === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading maps........</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Header style={styles.header}>
          <Text style={styles.titleHeader}>Crime Maps</Text>
        </Header>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          {dataKecamatan.map((kec, index) => {
            return (
              <Polygon
                key={index}
                coordinates={kec.cords}
                fillColor={
                  kec.status == "dangerous"
                    ? "rgba(255, 0, 0, 0.4)"
                    : kec.status == "warning"
                    ? "rgba(255, 200, 100, 0.4)"
                    : "rgba(100, 200, 200, 0.5)"
                }
                strokeColor={
                  kec.status == "dangerous"
                    ? "rgba(255, 0, 0, 0.5)"
                    : kec.status == "warning"
                    ? "rgba(255, 200, 200, 0.5)"
                    : "rgba(100, 200, 200, 0.5)"
                }
                tappable={true}
                onPress={() => showModal(kec)}
              ></Polygon>
            );
          })}
        </MapView>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ color: "#283148", fontWeight: "bold", fontSize: 18 }}>{dataModal.city}</Text>
              <Text style={{ marginBottom: 10, fontSize: 12, color: "#913535", fontWeight: "bold" }}>
                {dataModal.name}
              </Text>
              <Text>Status: {dataModal.status}</Text>

              <Text>Population: {dataModal.population}</Text>
              <Text>abduction: {dataModal.abduction} case</Text>
              <Text>anarchism: {dataModal.anarchism} case</Text>
              <Text>Drugs: {dataModal.drugs} case</Text>
              <Text>Fraudulency: {dataModal.fraudulency} case</Text>
              <Text>Harassment: {dataModal.harassment} case</Text>
              <Text>Homicide: {dataModal.homicide} case</Text>
              <Text>Robbery {dataModal.robbery} case</Text>
              <Text>Theft: {dataModal.theft} case</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#283148", borderRadius: 10, marginVertical: 10 }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={modalAlert}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>{status}</Text>
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#283148", borderRadius: 10 }}
                  onPress={() => {
                    setModalAlert(false);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: "#fff",
                    borderColor: "#913535",
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    changePage();
                  }}
                >
                  <Text style={(styles.textStyle, { color: "#913535", fontWeight: "bold" })}>See DOs and DONTs</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    height: screenHeight - 105,
    width: screenWidth,
  },
  header: {
    width: screenWidth,
    height: 60,
    paddingTop: 7,
    justifyContent: "center",
    backgroundColor: "#283148",
  },
  titleHeader: {
    paddingTop: 22,
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
});

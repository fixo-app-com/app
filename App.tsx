import "./global.css";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/components/HomeScreen/HomeScreen";

export default function App() {
  return (
    <>
      <HomeScreen />
      <StatusBar style="light" />
    </>
  );
}

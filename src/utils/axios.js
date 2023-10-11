import axios from "axios";

const dataInstance = axios.create({
  baseURL: "http://172.16.53.16:8081" 
});
export default dataInstance;
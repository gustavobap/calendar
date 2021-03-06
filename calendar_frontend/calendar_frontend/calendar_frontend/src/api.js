import axios from "axios";

export default axios.create({
  baseURL: `${process.env.REACT_APP_API_ORIGIN}`,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

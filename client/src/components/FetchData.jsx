import { useEffect } from "react";
import { fetchData } from "reducers/data";
import { useDispatch } from "react-redux";

const FetchData = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  return null;
};

export default FetchData;

import {useEffect} from 'react';
import {fetchData} from 'actions/data';
import {connect} from 'react-redux';

const FetchData = ({fetchDataAction}) => {
  useEffect(() => { fetchDataAction() }, [])
  return null;
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDataAction: () => dispatch(fetchData()),
  };
};

export default connect (null, mapDispatchToProps)(FetchData);

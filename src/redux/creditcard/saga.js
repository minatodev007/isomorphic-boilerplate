import { all, takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';
// import { getToken } from '@iso/lib/helpers/utility';
import siteConfig from '@iso/config/site.config';
import notification from '@iso/components/Notification';
import actions from './actions';

const onCallReqeust = async (URI) =>
  await axios
    .get(URI)
    .then((res) => res)
    .catch((error) => error);
const onPostCallReqeust = async (sendData, URI) =>
  await axios
    .post(URI, sendData)
    .then((res) => res)
    .catch((error) => error);
const onPutCallReqeust = async (sendData, URI) =>
  await axios
    .put(URI, sendData)
    .then((res) => res)
    .catch((error) => error);
const onDeleteCallReqeust = async (URI) =>
  await axios
    .delete(URI)
    .then((res) => res)
    .catch((error) => error);
export function* getCreditCards() {
  axios.defaults.headers.get['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onCallReqeust,
      `${siteConfig.apiUrl}/creditcard`
    );

    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      var temp = [];
      callResult.data.data.map((value, index) => {
        value.key = index + 1;
        temp.push(value);
      });
      yield put({
        type: actions.GET_CREDIT_CARD_REDUCER,
        data: temp, //createDemoData(),
      });
    }
  } catch (error) {
    notification('error', 'Internal server error!');
  }
}

export function* addCreditCard({ payload }) {
  axios.defaults.headers.post['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onPostCallReqeust,
      payload.sendData,
      `${siteConfig.apiUrl}/creditcard`
    );

    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      notification('success', callResult.data.msg);
      yield put({
        type: actions.GET_CREDIT_CARDS,
      });
    }
  } catch (error) {
    yield put({ type: actions.ADD_FAILED, msg: 'Server Internal error!' });
  }
}
export function* updateCreditCard({ payload }) {
  axios.defaults.headers.put['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onPutCallReqeust,
      payload.sendData,
      `${siteConfig.apiUrl}/creditcard/${payload.id}`
    );

    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      notification('success', callResult.data.msg);
      yield put({
        type: actions.GET_CREDIT_CARDS,
      });
    }
  } catch (error) {
    notification('success', 'Server Internal error!');
  }
}

export function* deleteCreditCard({ payload }) {
  axios.defaults.headers.delete['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onDeleteCallReqeust,
      `${siteConfig.apiUrl}/creditcard/${payload.id}`
    );
    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      notification('success', callResult.data.msg);
      yield put({
        type: actions.GET_CREDIT_CARDS,
      });
    }
  } catch (error) {
    notification('error', 'Server Internal error!');
  }
}
export function* createdId() {
  axios.defaults.headers.get['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onCallReqeust,
      `${siteConfig.apiUrl}/creditcard`
    );

    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      yield put({
        type: actions.CREATED_CREDIT_CARD_ID_REDUCER,
        data: callResult.data.data[0] ? callResult.data.data[0]._id + 1 : 0,
      });
    }
  } catch (error) {
    notification('error', 'Internal server error!');
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.GET_CREDIT_CARDS, getCreditCards),
    yield takeEvery(actions.ADD_CREDIT_CARD, addCreditCard),
    yield takeEvery(actions.UPDATE_CREDIT_CARD, updateCreditCard),
    yield takeEvery(actions.DELETE_CREDIT_CARD, deleteCreditCard),
    yield takeEvery(actions.CREATED_CREDIT_CARD_ID, createdId),
  ]);
}

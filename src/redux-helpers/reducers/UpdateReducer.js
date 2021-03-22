import Constants from '../../helpers/constants';
import {UPDATES} from '../Types';

export const UpdateReducer = (
  state = Constants.UPDATE.ORDER_LOADED,
  action,
) => {
  switch (action.type) {
    case UPDATES:
      return action.payload;
    default:
      return state;
  }
};

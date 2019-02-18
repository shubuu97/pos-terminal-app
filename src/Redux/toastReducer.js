const commonData = (state = {
    message: {},
  }, action) => {
    switch (action.type) {
      case 'SHOW_TOAST_MESSAGE':
        return Object.assign({}, state, {
          type: action.type,
          message: action.data
        });
    }
    return state;
  }

export default commonData;
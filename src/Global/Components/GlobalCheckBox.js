import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


let GlobalCheckBox = (props) => {
  const { classes, label,checked, name, input,color, ...rest } = props;

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(event, value) => input.onChange(value)}
            color={color}
            checked={input.value}
            value={input.value}
          />
        }
        label={label}
      />
    </div>
  );
}


export default GlobalCheckBox;

import * as React from 'react';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface FormValue {
  name: string;
  price: number;
}

export const CreateAuctionForm = () => {
  return (
    <Formik<FormValue>
      initialValues={{
        name: '',
        price: 0,
      }}
      onSubmit={({ name, price }) => {}}
    >
      {({ values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              name="name"
              label="Name"
              value={values.name}
              onChange={handleChange}
              margin="normal"
            />
          </div>
          <div>
            <TextField
              name="price"
              label="Price"
              value={values.price}
              onChange={handleChange}
              margin="normal"
            />
          </div>
          <div>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

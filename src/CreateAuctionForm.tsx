import * as React from 'react';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import produce from 'immer';

import { createAuction } from './graphql/mutations';
import {
  CreateAuctionMutation,
  CreateAuctionMutationVariables,
  ListAuctionsQuery,
} from './API';
import { listAuctions } from './graphql/queries';

interface FormValue {
  name: string;
  price: number;
}

export const CreateAuctionForm = () => {
  return (
    <Mutation<CreateAuctionMutation, CreateAuctionMutationVariables>
      mutation={gql(createAuction)}
    >
      {createAuction => (
        <Formik<FormValue>
          initialValues={{
            name: '',
            price: 0,
          }}
          onSubmit={async ({ name, price }, { resetForm }) => {
            const response = await createAuction({
              variables: {
                input: {
                  name,
                  price,
                },
              },
              optimisticResponse: {
                createAuction: {
                  __typename: 'Auction',
                  id: '-1',
                  name,
                  price,
                },
              },
              update: (store, { data }) => {
                if (!data || !data.createAuction) return;

                const auctions = store.readQuery<ListAuctionsQuery>({
                  query: gql(listAuctions),
                  variables: { limit: 100 },
                });

                store.writeQuery({
                  query: gql(listAuctions),
                  variables: { limit: 100 },
                  data: produce(auctions, ds => {
                    ds!.listAuctions!.items!.unshift(data.createAuction);
                  }),
                });
              },
            });
            console.log(response);
            resetForm();
          }}
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
      )}
    </Mutation>
  );
};

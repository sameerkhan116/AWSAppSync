import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { ListAuctionsQuery, ListAuctionsQueryVariables } from './API';
import { listAuctions } from './graphql/queries';
import { AuctionCard } from './AuctionCard';
import { OnMount } from './components/OnMount';
import { onCreateAuction } from './graphql/subscriptions';
import { buildSubscription } from 'aws-appsync';

export const Auctions = () => {
  return (
    <Query<ListAuctionsQuery, ListAuctionsQueryVariables>
      query={gql(listAuctions)}
      variables={{ limit: 100 }}
    >
      {({ data, loading, subscribeToMore }) =>
        loading ||
        !data ||
        !data.listAuctions ||
        !data.listAuctions.items ? null : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridGap: '10px',
            }}
          >
            <OnMount
              onEffect={() =>
                subscribeToMore(
                  buildSubscription(gql(onCreateAuction), gql(listAuctions)),
                )
              }
            />
            {data.listAuctions.items.map(
              x =>
                !x ? null : (
                  <AuctionCard name={x.name} price={x.price} key={x.id} />
                ),
            )}
          </div>
        )
      }
    </Query>
  );
};

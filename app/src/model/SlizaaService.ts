import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

export class SlizaaService {

    private client = new ApolloClient({
        uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
      });

      /**
       * resolve
       */
      public resolve() {

        this.client
        .query({
          query: gql`
            {
              rates(currency: "USD") {
                currency
              }
            }
          `
        })
        // tslint:disable-next-line:no-console
        .then(result => console.log(result)); 
      }

}
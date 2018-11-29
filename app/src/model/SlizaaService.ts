import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

export class SlizaaService {

    private client = new ApolloClient({
        // uri: window.location.origin + "/graphql/"
        uri: "http://localhost:8085/graphql"
      });

      /**
       * resolve
       */
      public resolve(query: string) : void {

        this.client
        .query({
            query: gql(query)
        })
        // tslint:disable-next-line:no-console
        .then(result => console.log(result.data));
      }

}
import gql from 'graphql-tag';

export const GQ_GET_SVG = gql`
  query Svg($identifier: ID!) {
    svg(identifier: $identifier) 
  }
`;
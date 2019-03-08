import gql from 'graphql-tag';

export const GQ_HAS_INSTALLED_EXTENSIONS = gql`
  query HasInstalledExtensions {
    hasInstalledExtensions
  }
 `;

 export const GQ_AVAILABLE_SERVER_EXTENSIONS = gql`
    query AvailableServerExtensions {
        availableServerExtensions {
            symbolicName
            version
        }
    }`;
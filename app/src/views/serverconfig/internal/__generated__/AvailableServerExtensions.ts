/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AvailableServerExtensions
// ====================================================

export interface AvailableServerExtensions_availableServerExtensions {
  __typename: "ServerExtension";
  /**
   * the symbolic name of the extension
   */
  symbolicName: string;
  /**
   * the version of the extension
   */
  version: string;
}

export interface AvailableServerExtensions {
  /**
   * Returns the available server extensions
   */
  availableServerExtensions: (AvailableServerExtensions_availableServerExtensions | null)[];
}

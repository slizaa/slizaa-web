package org.slizaa.server;

import org.slizaa.server.graphql.EnableGraphqlModule;
import org.slizaa.server.service.backend.EnableBackendModule;
import org.slizaa.server.service.extensions.EnableExtensionsModule;
import org.slizaa.server.service.slizaa.EnableSlizaaServiceModule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 *
 * @author Gerd W&uuml;therich (gerd@gerd-wuetherich.de)
 */
@SpringBootApplication
@EnableExtensionsModule
@EnableBackendModule
@EnableSlizaaServiceModule
@EnableGraphqlModule
public class SlizaaServer {

  /**
   *
   * @param args
   */
  public static void main(String[] args) {
    SpringApplication.run(SlizaaServer.class, args);
  }
}
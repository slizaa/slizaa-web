package org.slizaa.server;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardingController {

    @RequestMapping(value = {"/meseros"})
    public String index() {
        return "forward:/";
    }
}
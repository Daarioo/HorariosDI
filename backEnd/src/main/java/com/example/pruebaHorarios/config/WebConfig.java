package com.example.pruebaHorarios.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
        registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/");
        registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static/images/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("index");
        registry.addViewController("/admin/ciclos").setViewName("ciclos");
        registry.addViewController("/admin/modulos").setViewName("modulos");
        registry.addViewController("/admin/alumnos").setViewName("alumnos");
        registry.addViewController("/admin/sesiones").setViewName("sesiones");
        registry.addViewController("/admin/profesores").setViewName("profesores");
        registry.addViewController("/public/horarios").setViewName("horario");
        registry.addViewController("/public/matriculaalumno").setViewName("matriculaalumno");
        registry.addViewController("/admin/ciclos_movil").setViewName("ciclos_movil");
        registry.addViewController("/admin/profesores_movil").setViewName("profesores_movil");
        registry.addViewController("/admin/matriculasadmin/**").setViewName("matriculasadmin");
        registry.addViewController("/admin/alumnos_movil").setViewName("alumnos_movil");
    }
}

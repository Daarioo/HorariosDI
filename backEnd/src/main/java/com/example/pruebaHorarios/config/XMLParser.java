package com.example.pruebaHorarios.config;

import com.example.pruebaHorarios.config.alumnoXML.Alumnado;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import java.io.File;

public class XMLParser {
    public static <T> T parseXML(String filePath, Class<T> clazz) {
        try {
            File file = new File(filePath);
            JAXBContext jaxbContext = JAXBContext.newInstance(clazz);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            return clazz.cast(jaxbUnmarshaller.unmarshal(file));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
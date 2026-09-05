package com.induwara.portfolio.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ContentStatusConverter implements AttributeConverter<ContentStatus, String> {

    @Override
    public String convertToDatabaseColumn(ContentStatus attribute) {
        return attribute != null ? attribute.name() : ContentStatus.DRAFT.name();
    }

    @Override
    public ContentStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return ContentStatus.DRAFT;
        try {
            return ContentStatus.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ContentStatus.DRAFT;
        }
    }
}

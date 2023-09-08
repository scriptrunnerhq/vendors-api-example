package com.scriptrunnerhq;

import com.atlassian.jira.issue.customfields.impl.AbstractSingleFieldType;
import com.atlassian.jira.issue.customfields.persistence.PersistenceFieldType;
import com.atlassian.plugin.spring.scanner.annotation.imports.JiraImport;
import com.atlassian.jira.issue.customfields.manager.GenericConfigManager;
import com.atlassian.jira.issue.customfields.persistence.CustomFieldValuePersister;
import com.atlassian.jira.issue.customfields.impl.FieldValidationException;
import java.math.BigDecimal;

public class CustomField extends AbstractSingleFieldType<String> {
    public CustomField(
            @JiraImport CustomFieldValuePersister customFieldValuePersister,
            @JiraImport GenericConfigManager genericConfigManager
        ) {
        super(customFieldValuePersister, genericConfigManager);
    }

    @Override
    public String getStringFromSingularObject(final String singularObject) {
        if (singularObject == null)
            return null;
        else
            return singularObject.toString();
    }

    @Override
    public String getSingularObjectFromString(final String string) throws FieldValidationException {
        return string;
    }

    @Override
    protected PersistenceFieldType getDatabaseType() {
        return PersistenceFieldType.TYPE_LIMITED_TEXT;
    }

    @Override
    protected String getObjectFromDbValue(final Object databaseValue)
            throws FieldValidationException {
        return getSingularObjectFromString((String) databaseValue);
    }

    @Override
    protected Object getDbValueFromObject(final String customFieldObject) {
        return getStringFromSingularObject(customFieldObject);
    }
}
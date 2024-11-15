#!/bin/bash
set -euf -o pipefail

echo "Add Key Vault secrets in application settings app service"
echo "Making a list from $KEY_VAULT"
echo "az keyvault secret list --vault-name $KEY_VAULT --query \"[].name\" -o tsv"
SECRETS+=($(az keyvault secret list --vault-name $KEY_VAULT --query "[].name" -o tsv))

echo "--- ---"
echo "Put SECRET into file APP_SECRET.txt"
echo "az webapp config appsettings list --name $APP_SERVICE --resource-group $RESOURCE_GROUP -o tsv > APP_SECRET.txt"
az webapp config appsettings list --name $APP_SERVICE --resource-group $RESOURCE_GROUP -o tsv > APP_SECRET.txt

echo "--- ---"
for SECRET in "${SECRETS[@]}";do

    SECRET_SINGLE=$(echo $SECRET | tr -d "\$\\\r'")
    echo "Get Sercet ID from ${SECRET_SINGLE}"
    echo "az keyvault secret show --name ${SECRET_SINGLE} --vault-name $KEY_VAULT --query id --output tsv"
    SECRETID=$(az keyvault secret show --name ${SECRET_SINGLE} --vault-name $KEY_VAULT --query id --output tsv)

    echo "--- ---"
    if grep --quiet $SECRETID APP_SECRET.txt; then
        echo $SECRET has newest SECRET_ID...
    else
        echo "--- ---"
        SECRET_UNDERSCORE=$(echo ${SECRET_SINGLE} | tr -s "-" _)
        echo "Assign value key vault references with Azure App Configuration"
        echo "az webapp config appsettings set --name $APP_SERVICE --resource-group $RESOURCE_GROUP --settings $SECRET_UNDERSCORE=\"@Microsoft.KeyVault(SecretUri=*********)\""
        az webapp config appsettings set --name $APP_SERVICE --resource-group $RESOURCE_GROUP --settings $SECRET_UNDERSCORE="@Microsoft.KeyVault(SecretUri=${SECRETID})" --slot-settings $SECRET_UNDERSCORE="@Microsoft.KeyVault(SecretUri=${SECRETID})" > log.txt
        echo "--- ---"
    fi
    echo "--- ---"
done

echo "Show app settinges environment variables"
cat log.txt | sed -E 's/[a-zA-Z0-9_]{32}\)/*************\)/g' || true

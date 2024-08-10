local ESX = exports['es_extended']:getSharedObject()

RegisterServerEvent('superette:PayMethode')
AddEventHandler('superette:PayMethode', function(price)
    exports.ox_inventory:RemoveItem(source, 'money', price)
end)

RegisterServerEvent('superette:PayCart')
AddEventHandler('superette:PayCart', function(items)
    local xPlayer = ESX.GetPlayerFromId(source)

    for _, item in ipairs(items) do
        exports.ox_inventory:AddItem(source, item.name, tonumber(item.quantite))
    end
end)
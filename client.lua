local ESX = exports['es_extended']:getSharedObject()
local Peds = {
    {hash = "mp_m_shopkeep_01", coords = vector4(24.42, -1345.67, 29.50 - 1.0, 265.50)},
    {hash = "mp_m_shopkeep_01", coords = vector4(270.70, -978.83, 29.37 - 1.0, 163.18)},
    {hash = "mp_m_shopkeep_01", coords = vector4(-706.15, -914.52, 19.22 - 1.0, 94.63)},
    {hash = "mp_m_shopkeep_01", coords = vector4(-1221.45, -907.94, 12.33 - 1.0, 39.63)},
    {hash = "mp_m_shopkeep_01", coords = vector4(1134.29, -983.02, 46.42 - 1.0, 279.94)},
    {hash = "mp_m_shopkeep_01", coords = vector4(-47.30, -1758.54, 29.42 - 1.0, 53.64)},
    {hash = "mp_m_shopkeep_01", coords = vector4(1164.85, -323.65, 69.21 - 1.0, 96.68)},
    {hash = "mp_m_shopkeep_01", coords = vector4(-1486.79, -377.53, 40.16 - 1.0, 136.73)},
    {hash = "mp_m_shopkeep_01", coords = vector4(372.92, 327.91, 103.57 - 1.0, 256.82)},
    {hash = "mp_m_shopkeep_01", coords = vector4(-3040.45, 584.08, 7.91 - 1.0, 22.74)},
    {hash = "mp_m_shopkeep_01", coords = vector4(1728.58, 6416.65, 35.04 - 1.0, 243.32)},
    {hash = "mp_m_shopkeep_01", coords = vector4(1959.30, 3741.44, 32.34 - 1.0, 302.92)},
    {hash = "mp_m_shopkeep_01", coords = vector4(1392.13, 3606.14, 34.98 - 1.0, 200.81)},
    {hash = "mp_m_shopkeep_01", coords = vector4(1165.20, 2710.78, 38.16 - 1.0, 185.11)},
}

Citizen.CreateThread(function()
    for _, v in ipairs(Peds) do
        RequestModel(GetHashKey(v.hash))
        while not HasModelLoaded(GetHashKey(v.hash)) do
            Wait(1)
        end
        ped = CreatePed("Peds", v.hash, v.coords, false, true)
        SetEntityHeading(ped, v.coords.w)
        FreezeEntityPosition(ped, true)
        SetEntityInvincible(ped, true)
        SetBlockingOfNonTemporaryEvents(ped, true)
    end
end)

Citizen.CreateThread(function()
    while true do
        local playerCoords = GetEntityCoords(PlayerPedId())
        for _, v in ipairs(Peds) do
            local pedCoords = v.coords
            local distance = GetDistanceBetweenCoords(playerCoords, pedCoords, true)
            if distance < 3.5 then
                ESX.ShowHelpNotification("Appuyez sur ~INPUT_CONTEXT~ pour ouvrir la superette")
                    if IsControlJustPressed(0, 38) then
                        showUI()
                    end
                break
            end
        end
        Citizen.Wait(0)
    end
end)

local superette = false

function showUI()
    if not superette then
        SendNUIMessage({action = "showSuperrette"})
        SetNuiFocus(true, true)
        superette = true
    else
        SendNUIMessage({action = "hideSuperrette"})
        SetNuiFocus(false, false)
        superette = false
    end
end

RegisterNUICallback("hideSuperrette", function(data, cb)
    showUI()
    cb("ok")
end)

RegisterNUICallback('sendPaiement', function(data, cb)
    SendNUIMessage({action = "paiement"})
    cb("ok")
end)

RegisterNUICallback('showEmptyCart', function(data, cb)
    exports['notifs2']:notification('~r~Votre panier est vide')
    cb("ok")
end)

RegisterNUICallback('sendPanier', function(data, cb)
    local items = {}

    for _, item in ipairs(data.panier) do
        table.insert(items, {
            name = item.name,
            quantite = item.quantite
        })
    end

    local count = exports.ox_inventory:Search('count', 'money')
    if count < data.total then
        exports['notifs2']:notification('~r~Vous n\'avez pas assez d\'argent')
    else
        TriggerServerEvent('superette:PayMethode', data.total)
        TriggerServerEvent('superette:PayCart', items)
    end

    cb("ok")
end)

RegisterCommand("superette", function()
    showUI()
end)

RegisterNetEvent('openMenuSuperette')
AddEventHandler('openMenuSuperette', function()
    showUI()
end)
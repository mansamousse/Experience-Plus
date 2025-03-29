import { ItemStack, world } from "@minecraft/server";
import { XP_CONFIG } from "./explus_config";

world.beforeEvents.worldInitialize.subscribe((initEvent) => {
    initEvent.itemComponentRegistry.registerCustomComponent("explus:transfusion_bottle_component",
        {
            onConsume: ({ itemStack, source }) => {
                // Create bottle o' enchanting item and give to player
                const experienceBottle = new ItemStack("minecraft:experience_bottle", 1);
                const inventory = source.getComponent("minecraft:inventory").container;
                switch (itemStack.typeId) {
                    // Check if the item is a transfusion bottle
                    case "explus:transfusion_bottle": {
                        // Check if player xp is equal to or greater than 15
                        const storedLevel = source.getTotalXp();
                        if (storedLevel >= XP_CONFIG.transfusionBottleXpCost) {
                            source.resetLevel();
                            source.addExperience(storedLevel - XP_CONFIG.transfusionBottleXpCost); // subtract xp from player
                            inventory.addItem(experienceBottle);
                        }
                        else {
                            source.sendMessage("Player does not have enough experience to use the transfusion bottle.");
                            source.applyDamage(XP_CONFIG.transfusionBottleHurt); // apply damage to player
                        }
                        /*
                        const experienceComponent = source.getComponent("minecraft:experience");
                        if (experienceComponent >= 15){console.warn("Player has enough experience to use the transfusion bottle.")}
                        else {console.warn("Player does not have enough experience to use the transfusion bottle.")}
                        */
                    }
                        break;
                    default:
                        console.warn("Item is not a transfusion bottle.");
                        break;
                }
            },
        }
    )
})


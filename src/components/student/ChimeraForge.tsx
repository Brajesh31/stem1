import React, { useState } from 'react';
import { 
  Hammer, 
  Package, 
  Sparkles, 
  Plus, 
  Info,
  Star,
  Zap,
  BookOpen,
  Award
} from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';

interface Reagent {
  id: string;
  name: string;
  description: string;
  icon: string;
  subject: string;
  quantity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CraftableItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'consumable' | 'cosmetic' | 'bridge-quest';
  recipe: { reagentId: string; quantity: number }[];
  effect?: string;
}

const ChimeraForge: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'craft' | 'inventory' | 'recipes'>('craft');
  const [selectedRecipe, setSelectedRecipe] = useState<CraftableItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock reagents inventory
  const reagents: Reagent[] = [
    { id: '1', name: 'Lever Blueprints', description: 'Mechanical engineering schematics', icon: '⚙️', subject: 'Physics', quantity: 12, rarity: 'common' },
    { id: '2', name: 'Sodium Salts', description: 'Pure chemical compounds', icon: '🧂', subject: 'Chemistry', quantity: 8, rarity: 'common' },
    { id: '3', name: 'Geometric Proofs', description: 'Mathematical theorems', icon: '📐', subject: 'Mathematics', quantity: 15, rarity: 'common' },
    { id: '4', name: 'DNA Sequences', description: 'Genetic code fragments', icon: '🧬', subject: 'Biology', quantity: 6, rarity: 'rare' },
    { id: '5', name: 'Quantum Particles', description: 'Subatomic matter', icon: '⚛️', subject: 'Physics', quantity: 3, rarity: 'epic' },
    { id: '6', name: 'Literary Metaphors', description: 'Poetic expressions', icon: '📝', subject: 'English', quantity: 9, rarity: 'rare' },
    { id: '7', name: 'Historical Artifacts', description: 'Ancient relics', icon: '🏺', subject: 'History', quantity: 4, rarity: 'legendary' },
  ];

  // Craftable items recipes
  const craftableItems: CraftableItem[] = [
    {
      id: '1',
      name: 'Scroll of Double XP',
      description: 'Doubles XP gain for 1 hour',
      icon: '📜',
      type: 'consumable',
      recipe: [
        { reagentId: '3', quantity: 5 },
        { reagentId: '1', quantity: 3 }
      ],
      effect: 'Double XP for 1 hour'
    },
    {
      id: '2',
      name: 'Hint Token',
      description: 'Reveals a hint on tough questions',
      icon: '💡',
      type: 'consumable',
      recipe: [
        { reagentId: '2', quantity: 4 },
        { reagentId: '6', quantity: 2 }
      ],
      effect: 'Reveals one hint'
    },
    {
      id: '3',
      name: 'Mystic Cape',
      description: 'A shimmering cape for your avatar',
      icon: '🧙‍♂️',
      type: 'cosmetic',
      recipe: [
        { reagentId: '4', quantity: 3 },
        { reagentId: '7', quantity: 1 }
      ]
    },
    {
      id: '4',
      name: 'Crown of Knowledge',
      description: 'Shows your mastery to all',
      icon: '👑',
      type: 'cosmetic',
      recipe: [
        { reagentId: '5', quantity: 2 },
        { reagentId: '7', quantity: 1 },
        { reagentId: '3', quantity: 10 }
      ]
    },
    {
      id: '5',
      name: 'Camera Lens',
      description: 'Required for photography Bridge Quests',
      icon: '📷',
      type: 'bridge-quest',
      recipe: [
        { reagentId: '1', quantity: 8 },
        { reagentId: '5', quantity: 1 }
      ]
    },
    {
      id: '6',
      name: 'Lab Equipment Set',
      description: 'Unlocks advanced chemistry experiments',
      icon: '🔬',
      type: 'bridge-quest',
      recipe: [
        { reagentId: '2', quantity: 10 },
        { reagentId: '4', quantity: 2 }
      ]
    },
    {
      id: '7',
      name: 'Inspiration Potion',
      description: 'Boosts creativity for 30 minutes',
      icon: '🧪',
      type: 'consumable',
      recipe: [
        { reagentId: '6', quantity: 5 },
        { reagentId: '4', quantity: 1 }
      ],
      effect: 'Enhanced creative thinking'
    },
    {
      id: '8',
      name: 'Phoenix Feather',
      description: 'Legendary cosmetic effect',
      icon: '🔥',
      type: 'cosmetic',
      recipe: [
        { reagentId: '7', quantity: 2 },
        { reagentId: '5', quantity: 3 }
      ]
    },
    {
      id: '9',
      name: 'Time Crystal',
      description: 'Extends quest deadlines by 24 hours',
      icon: '⏰',
      type: 'consumable',
      recipe: [
        { reagentId: '5', quantity: 1 },
        { reagentId: '3', quantity: 15 }
      ],
      effect: '+24 hours on quest timers'
    },
    {
      id: '10',
      name: 'Telescope Lens',
      description: 'For astronomy Bridge Quests',
      icon: '🔭',
      type: 'bridge-quest',
      recipe: [
        { reagentId: '1', quantity: 6 },
        { reagentId: '3', quantity: 8 }
      ]
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300 border-gray-400/30';
      case 'rare': return 'text-blue-300 border-blue-400/30';
      case 'epic': return 'text-purple-300 border-purple-400/30';
      case 'legendary': return 'text-yellow-300 border-yellow-400/30';
      default: return 'text-gray-300 border-gray-400/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consumable': return 'bg-green-500/20 text-green-300';
      case 'cosmetic': return 'bg-purple-500/20 text-purple-300';
      case 'bridge-quest': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const canCraft = (recipe: CraftableItem) => {
    return recipe.recipe.every(ingredient => {
      const reagent = reagents.find(r => r.id === ingredient.reagentId);
      return reagent && reagent.quantity >= ingredient.quantity;
    });
  };

  const handleCraft = (item: CraftableItem) => {
    if (!canCraft(item)) {
      dispatch(addNotification({ type: 'error', title: 'Insufficient Materials', message: 'You don\'t have enough reagents to craft this item.' }));
      return;
    }

    // Simulate crafting animation and process
    setIsLoading(true);
    
    setTimeout(() => {
      // Update reagent quantities
      item.recipe.forEach(ingredient => {
        const reagentIndex = reagents.findIndex(r => r.id === ingredient.reagentId);
        if (reagentIndex !== -1) {
          reagents[reagentIndex].quantity -= ingredient.quantity;
        }
      });
      
      dispatch(addNotification({ 
        type: 'success', 
        title: 'Item Forged!', 
        message: `Successfully crafted ${item.name}! Check your inventory.` 
      }));
      
      setSelectedRecipe(null);
      setIsLoading(false);
    }, 2000);
  };

  const renderCraftingInterface = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recipe List */}
      <div className="lg:col-span-2">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-orange-400" />
            Available Recipes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {craftableItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRecipe(item)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedRecipe?.id === item.id
                    ? 'bg-orange-500/20 border-orange-400/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type.replace('-', ' ')}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-1">{item.name}</h4>
                <p className="text-white/70 text-sm mb-3">{item.description}</p>
                {item.effect && (
                  <p className="text-orange-300 text-xs font-medium">Effect: {item.effect}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-medium ${canCraft(item) ? 'text-green-300' : 'text-red-300'}`}>
                    {canCraft(item) ? 'Can Craft' : 'Missing Materials'}
                  </span>
                  <Info className="w-4 h-4 text-white/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crafting Panel */}
      <div className="lg:col-span-1">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Hammer className="w-6 h-6 mr-2 text-orange-400" />
            Crafting Station
          </h3>

          {selectedRecipe ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-3">{selectedRecipe.icon}</div>
                <h4 className="text-lg font-semibold text-white">{selectedRecipe.name}</h4>
                <p className="text-white/70 text-sm">{selectedRecipe.description}</p>
              </div>

              <div>
                <h5 className="font-medium text-white mb-3">Required Materials:</h5>
                <div className="space-y-2">
                  {selectedRecipe.recipe.map((ingredient) => {
                    const reagent = reagents.find(r => r.id === ingredient.reagentId);
                    const hasEnough = reagent && reagent.quantity >= ingredient.quantity;
                    
                    return (
                      <div key={ingredient.reagentId} className={`flex items-center justify-between p-3 rounded-lg ${
                        hasEnough ? 'bg-green-500/10 border border-green-400/30' : 'bg-red-500/10 border border-red-400/30'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{reagent?.icon}</span>
                          <span className="text-white text-sm">{reagent?.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${hasEnough ? 'text-green-300' : 'text-red-300'}`}>
                          {reagent?.quantity || 0}/{ingredient.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleCraft(selectedRecipe)}
                disabled={!canCraft(selectedRecipe) || isLoading}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  canCraft(selectedRecipe) && !isLoading
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500'
                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Hammer className="w-5 h-5 mr-2" />
                {isLoading ? 'Forging...' : canCraft(selectedRecipe) ? 'Forge Item' : 'Insufficient Materials'}
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
              <p className="text-white/60">Select a recipe to begin crafting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Package className="w-6 h-6 mr-2 text-blue-400" />
        Reagent Inventory
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reagents.map((reagent) => (
          <div key={reagent.id} className={`p-4 rounded-lg border ${getRarityColor(reagent.rarity)} bg-white/5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{reagent.icon}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{reagent.quantity}</div>
                <div className={`text-xs font-medium ${getRarityColor(reagent.rarity).split(' ')[0]}`}>
                  {reagent.rarity}
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-white mb-1">{reagent.name}</h4>
            <p className="text-white/70 text-sm mb-2">{reagent.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">{reagent.subject}</span>
              <div className="flex items-center space-x-1">
                {Array.from({ length: reagent.rarity === 'legendary' ? 4 : reagent.rarity === 'epic' ? 3 : reagent.rarity === 'rare' ? 2 : 1 }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${getRarityColor(reagent.rarity).split(' ')[0]}`} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecipeBook = () => (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <BookOpen className="w-6 h-6 mr-2 text-purple-400" />
        Recipe Compendium
      </h3>

      <div className="space-y-6">
        {['consumable', 'cosmetic', 'bridge-quest'].map((type) => (
          <div key={type}>
            <h4 className="text-lg font-medium text-white mb-4 capitalize flex items-center">
              {type === 'consumable' && <Zap className="w-5 h-5 mr-2 text-green-400" />}
              {type === 'cosmetic' && <Star className="w-5 h-5 mr-2 text-purple-400" />}
              {type === 'bridge-quest' && <Plus className="w-5 h-5 mr-2 text-blue-400" />}
              {type.replace('-', ' ')} Items
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {craftableItems.filter(item => item.type === type).map((item) => (
                <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h5 className="font-semibold text-white">{item.name}</h5>
                      <p className="text-white/70 text-sm">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm font-medium">Recipe:</p>
                    {item.recipe.map((ingredient) => {
                      const reagent = reagents.find(r => r.id === ingredient.reagentId);
                      return (
                        <div key={ingredient.reagentId} className="flex items-center justify-between text-sm">
                          <span className="text-white/70">{reagent?.icon} {reagent?.name}</span>
                          <span className="text-white/60">×{ingredient.quantity}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {item.effect && (
                    <div className="mt-3 p-2 bg-orange-500/10 rounded border border-orange-400/30">
                      <p className="text-orange-300 text-xs">Effect: {item.effect}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Hammer className="w-8 h-8 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Spark Forge</h1>
        </div>
        <div className="text-white/70">
          Craft legendary items from Knowledge Crystals & Effort Sparks
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'craft', label: 'Legendary Forge', icon: Hammer },
            { id: 'inventory', label: 'Crystal Vault', icon: Package },
            { id: 'recipes', label: 'Arcane Recipes', icon: BookOpen },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg border-white/20'
                    : 'text-white/70 hover:bg-white/10 border-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'craft' && renderCraftingInterface()}
      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'recipes' && renderRecipeBook()}
    </div>
  );
};

export default ChimeraForge;
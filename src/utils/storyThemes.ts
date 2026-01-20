// Story theme configuration based on category/tags from backend

export interface StoryTheme {
    colors: string[];
    icon: string;
}

// Predefined themes for different story categories
const STORY_THEMES: Record<string, StoryTheme> = {
    // Nature & Animals
    animals: {
        colors: ['#065F46', '#047857', '#059669'],
        icon: 'paw',
    },
    nature: {
        colors: ['#064E3B', '#065F46', '#047857'],
        icon: 'leaf',
    },
    forest: {
        colors: ['#064E3B', '#065F46', '#047857'],
        icon: 'leaf',
    },
    ocean: {
        colors: ['#0C4A6E', '#075985', '#0369A1'],
        icon: 'water',
    },
    sea: {
        colors: ['#0C4A6E', '#075985', '#0369A1'],
        icon: 'water',
    },

    // Fantasy & Magic
    magic: {
        colors: ['#4C1D95', '#5B21B6', '#6D28D9'],
        icon: 'sparkles',
    },
    fairy: {
        colors: ['#831843', '#9F1239', '#BE123C'],
        icon: 'sparkles',
    },
    wizard: {
        colors: ['#4C1D95', '#5B21B6', '#6D28D9'],
        icon: 'sparkles',
    },

    // Space & Sky
    space: {
        colors: ['#1E1B4B', '#312E81', '#4C1D95'],
        icon: 'planet',
    },
    moon: {
        colors: ['#1E1B4B', '#312E81', '#4C1D95'],
        icon: 'moon',
    },
    stars: {
        colors: ['#1E1B4B', '#312E81', '#4C1D95'],
        icon: 'star',
    },
    night: {
        colors: ['#1E1B4B', '#312E81', '#4C1D95'],
        icon: 'moon',
    },

    // Adventure
    adventure: {
        colors: ['#92400E', '#B45309', '#D97706'],
        icon: 'rocket',
    },
    journey: {
        colors: ['#92400E', '#B45309', '#D97706'],
        icon: 'compass',
    },
    treasure: {
        colors: ['#92400E', '#B45309', '#D97706'],
        icon: 'diamond',
    },

    // Bedtime & Calm
    bedtime: {
        colors: ['#1E3A8A', '#1E40AF', '#2563EB'],
        icon: 'moon',
    },
    sleep: {
        colors: ['#1E3A8A', '#1E40AF', '#2563EB'],
        icon: 'moon',
    },
    calm: {
        colors: ['#155E75', '#0E7490', '#0891B2'],
        icon: 'cloud',
    },
    dream: {
        colors: ['#4C1D95', '#5B21B6', '#6D28D9'],
        icon: 'cloud',
    },

    // Friendship & Love
    friendship: {
        colors: ['#BE185D', '#DB2777', '#EC4899'],
        icon: 'heart',
    },
    love: {
        colors: ['#BE185D', '#DB2777', '#EC4899'],
        icon: 'heart',
    },
    family: {
        colors: ['#BE185D', '#DB2777', '#EC4899'],
        icon: 'people',
    },

    // Default fallback
    default: {
        colors: ['#374151', '#4B5563', '#6B7280'],
        icon: 'book',
    },
};

/**
 * Get theme based on story category or tags
 * @param category - Main category from backend
 * @param tags - Array of tags from backend
 * @returns StoryTheme with colors and icon
 */
export const getStoryTheme = (
    category?: string,
    tags?: string[]
): StoryTheme => {
    // First, try to match category
    if (category) {
        const categoryLower = category.toLowerCase();
        if (STORY_THEMES[categoryLower]) {
            return STORY_THEMES[categoryLower];
        }
    }

    // Then, try to match any tag
    if (tags && tags.length > 0) {
        for (const tag of tags) {
            const tagLower = tag.toLowerCase();
            if (STORY_THEMES[tagLower]) {
                return STORY_THEMES[tagLower];
            }
        }
    }

    // Return default theme
    return STORY_THEMES.default;
};

/**
 * Get theme based on story title keywords
 * Useful when category/tags are not available
 * @param title - Story title
 * @returns StoryTheme
 */
export const getThemeFromTitle = (title: string): StoryTheme => {
    const titleLower = title.toLowerCase();

    // Check for keywords in title
    for (const [key, theme] of Object.entries(STORY_THEMES)) {
        if (titleLower.includes(key)) {
            return theme;
        }
    }

    return STORY_THEMES.default;
};

/**
 * Generate a random theme from a predefined set
 * Useful for variety when no specific category matches
 * @returns StoryTheme
 */
export const getRandomTheme = (): StoryTheme => {
    const themes = [
        STORY_THEMES.animals,
        STORY_THEMES.ocean,
        STORY_THEMES.magic,
        STORY_THEMES.space,
        STORY_THEMES.adventure,
        STORY_THEMES.bedtime,
    ];

    return themes[Math.floor(Math.random() * themes.length)];
};

/**
 * Get category theme for category cards
 * @param categoryId - Category identifier
 * @returns Theme with gradient colors and icon
 */
export const getCategoryTheme = (categoryId: string): StoryTheme => {
    const categoryThemes: Record<string, StoryTheme> = {
        animals: {
            colors: ['#FFB5E8', '#FF9CEE'],
            icon: 'paw',
        },
        adventure: {
            colors: ['#B4E7FF', '#7DD3FC'],
            icon: 'rocket',
        },
        magic: {
            colors: ['#DDD6FE', '#C4B5FD'],
            icon: 'sparkles',
        },
        nature: {
            colors: ['#BBF7D0', '#86EFAC'],
            icon: 'leaf',
        },
        space: {
            colors: ['#FED7AA', '#FDBA74'],
            icon: 'planet',
        },
        ocean: {
            colors: ['#A5F3FC', '#67E8F9'],
            icon: 'water',
        },
        bedtime: {
            colors: ['#C4B5FD', '#A78BFA'],
            icon: 'moon',
        },
        friendship: {
            colors: ['#FBCFE8', '#F9A8D4'],
            icon: 'heart',
        },
    };

    return categoryThemes[categoryId] || {
        colors: ['#E5E7EB', '#D1D5DB'],
        icon: 'book',
    };
};

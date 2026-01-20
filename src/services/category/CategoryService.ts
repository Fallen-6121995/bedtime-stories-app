import ApiClient from '../api/ApiClient';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  promptKey: string;
  storyCount: number;
  isActive: boolean;
  order: number;
}

export interface CategoryResponse {
  categories: Category[];
}

export interface CategoryStoriesResponse {
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  stories: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

class CategoryService {
  /**
   * Get all active categories
   * GET /api/categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await ApiClient.get<CategoryResponse>('/categories');
      return response.categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  /**
   * Get stories in a category by slug
   * GET /api/categories/:categorySlug/stories
   */
  async getCategoryStories(
    categorySlug: string,
    page: number = 1,
    limit: number = 20
  ): Promise<CategoryStoriesResponse> {
    try {
      const response = await ApiClient.get<CategoryStoriesResponse>(
        `/categories/${categorySlug}/stories`,
        { page: page.toString(), limit: limit.toString() }
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch stories for category ${categorySlug}:`, error);
      throw error;
    }
  }

  /**
   * Get category by ID (from the categories list)
   */
  async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      const categories = await this.getCategories();
      return categories.find(cat => cat.id === categoryId) || null;
    } catch (error) {
      console.error(`Failed to get category ${categoryId}:`, error);
      return null;
    }
  }

  /**
   * Get category by slug (from the categories list)
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const categories = await this.getCategories();
      return categories.find(cat => cat.slug === slug) || null;
    } catch (error) {
      console.error(`Failed to get category with slug ${slug}:`, error);
      return null;
    }
  }
}

export default new CategoryService();

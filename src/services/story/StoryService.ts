import ApiClient from '../api/ApiClient';

export interface Story {
  id: string;
  title: string;
  titles?: Record<string, string>;
  subtitle?: string;
  description?: string;
  category?: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  tags?: string[];
  duration?: number;
  ageGroup?: string;
  languageCodes?: string[];
  imageUrl?: string;
  imageUrls?: string[];
  audioUrls?: Record<string, string>;
  createdAt?: string;
  isPublic?: boolean;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface StoriesResponse {
  stories: Story[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CategoryStoriesResponse {
  stories: Story[];
  total: number;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
}

class StoryService {
  /**
   * Get all stories (public + user's private if authenticated)
   * GET /api/stories/all-stories
   */
  async getAllStories(params?: {
    categoryId?: string;
    ageGroup?: string;
    tags?: string[];
  }): Promise<Story[]> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (params?.categoryId) queryParams.categoryId = params.categoryId;
      if (params?.ageGroup) queryParams.ageGroup = params.ageGroup;
      if (params?.tags) queryParams.tags = params.tags.join(',');

      const stories = await ApiClient.get<Story[]>('/stories/all-stories', queryParams);
      return stories;
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      throw error;
    }
  }

  /**
   * Get stories by category ID
   * GET /api/stories/category/:categoryId
   */
  async getStoriesByCategory(
    categoryId: string,
    params?: {
      limit?: number;
      skip?: number;
      ageGroup?: string;
    }
  ): Promise<CategoryStoriesResponse> {
    try {
      const queryParams: Record<string, string> = {};
      

      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.skip) queryParams.skip = params.skip.toString();
      if (params?.ageGroup) queryParams.ageGroup = params.ageGroup;

      const response = await ApiClient.get<CategoryStoriesResponse>(
        `/stories/category/${categoryId}`,
        queryParams
      );
      console.log("first res>>>>>>>>>>>")
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(`Failed to fetch stories for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Get story by ID
   * GET /api/stories/:id/story-details
   */
  async getStoryById(storyId: string): Promise<Story> {
    try {
      const story = await ApiClient.get<Story>(`/stories/${storyId}/story-details`);
      return story;
    } catch (error) {
      console.error(`Failed to fetch story ${storyId}:`, error);
      throw error;
    }
  }

  /**
   * Generate a new story
   * POST /api/stories/generate-story
   */
  async generateStory(params: {
    categoryId: string;
    childName: string;
    ageGroup: string;
    topic: string;
    language: string;
    lengthPreference?: 'short' | 'medium' | 'long';
    isPublic?: boolean;
    tags?: string[];
  }): Promise<Story> {
    try {
      const story = await ApiClient.post<Story>('/stories/generate-story', params);
      return story;
    } catch (error) {
      console.error('Failed to generate story:', error);
      throw error;
    }
  }
}

export default new StoryService();

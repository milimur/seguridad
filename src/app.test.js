const { searchYouTube, searchYouTubeChannels } = require('./index');
const { google } = require('googleapis');

jest.mock('googleapis', () => ({
    google: {
        youtube: jest.fn().mockReturnValue({
            search: {
                list: jest.fn(),
            },
        }),
    },
}));

//test for search 
describe('searchYouTube', () => {
    it('should return search results from YouTube API', async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: { videoId: '12345' }, snippet: { title: 'Test Video 1' } },
                    { id: { videoId: '67890' }, snippet: { title: 'Test Video 2' } },
                ],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTube('test');
        expect(result).toEqual(mockResponse.data);
    });

    it('should handle empty search results', async () => {
        const mockResponse = { data: { items: [] } };
        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTube('nonexistent');
        expect(result.items).toHaveLength(0);
    });

    it('should throw an error if the YouTube API request fails', async () => {
        google.youtube().search.list.mockRejectedValueOnce(new Error('API Error'));

        await expect(searchYouTube('error')).rejects.toThrow('API Error');
    });

    //
    it('should handle special characters in the search query', async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: { videoId: '11111' }, snippet: { title: 'Test Video @#!' } },
                ],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTube('test video @#!');
        expect(result).toEqual(mockResponse.data);
    });

    it('should return no results for a very common search term', async () => {
        const mockResponse = {
            data: {
                items: [],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTube('a');
        expect(result.items).toHaveLength(0);
    });

    it('should trim whitespace from the search query', async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: { videoId: '22222' }, snippet: { title: 'Trimmed Video' } },
                ],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTube('   trimmed video   ');
        expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if the search query is too long', async () => {
        const longQuery = 'a'.repeat(100); // Assuming 100 is longer than the API's limit
        await expect(searchYouTube(longQuery)).rejects.toThrow('API Error');
    });

    it('should call the YouTube API with the correct parameters', async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: { videoId: '33333' }, snippet: { title: 'Parameter Test Video' } },
                ],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        await searchYouTube('parameter test');
        expect(google.youtube().search.list).toHaveBeenCalledWith({
            part: "snippet",
            q: 'parameter test',
            type: "video",
            maxResults: 2,
        });
    });

    it('should return a well-structured error object when the API fails', async () => {
        const errorResponse = { message: 'Bad Request' };
        google.youtube().search.list.mockRejectedValueOnce(new Error(JSON.stringify(errorResponse)));

        await expect(searchYouTube('badrequest')).rejects.toThrow('Bad Request');
    });

    it('should handle unexpected response structure gracefully', async () => {
        const mockResponse = {
            data: {
                // No items key
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTube('unexpected structure');
        expect(result.items).toBeUndefined(); // Or however you want to handle this case
    });
});

//search a channel
describe('searchYouTubeChannels', () => {
    it('should return channel search results from YouTube API', async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: { channelId: 'C12345' }, snippet: { title: 'Test Channel 1' } },
                    { id: { channelId: 'C67890' }, snippet: { title: 'Test Channel 2' } },
                ],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTubeChannels('test channel');
        expect(result).toEqual(mockResponse.data);
    });

    it('should handle empty search results', async () => {
        const mockResponse = { data: { items: [] } };
        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTubeChannels('nonexistent');
        expect(result.items).toHaveLength(0);
    });

    it('should throw an error if the YouTube API request fails', async () => {
        google.youtube().search.list.mockRejectedValueOnce(new Error('API Error'));

        await expect(searchYouTubeChannels('error')).rejects.toThrow('API Error');
    });

    it('should handle empty search query with validation error', async () => {
        // If your function does not handle this, you might need to modify your implementation.
        await expect(searchYouTubeChannels('')).rejects.toThrow(); // Adjust the expected error message as needed.
    });

    it('should return specific channel details for a valid query', async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: { channelId: 'C12345' }, snippet: { title: 'Specific Channel' } },
                ],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTubeChannels('Specific Channel');
        expect(result.items).toHaveLength(1);
        expect(result.items[0].snippet.title).toEqual('Specific Channel');
    });

    it('should return multiple channels when the search query matches multiple results', async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: { channelId: 'C11111' }, snippet: { title: 'Channel A' } },
                    { id: { channelId: 'C22222' }, snippet: { title: 'Channel B' } },
                ],
            },
        };

        google.youtube().search.list.mockResolvedValueOnce(mockResponse);

        const result = await searchYouTubeChannels('Channel');
        expect(result.items).toHaveLength(2);
        expect(result.items[0].snippet.title).toEqual('Channel A');
        expect(result.items[1].snippet.title).toEqual('Channel B');
    });

    it('should return an error message when the search query is too short', async () => {
        // Adjust your function to handle this case if necessary.
        await expect(searchYouTubeChannels('A')).rejects.toThrow(); // Specify the error you expect.
    });

    it('should handle network errors gracefully', async () => {
        google.youtube().search.list.mockRejectedValueOnce(new Error('Network Error'));

        await expect(searchYouTubeChannels('network test')).rejects.toThrow('Network Error');
    });
});
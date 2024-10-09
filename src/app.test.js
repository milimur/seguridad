const { searchYouTube, searchYouTubeChannels, getYouTubeComments} = require('./index');
const { google } = require('googleapis');

jest.mock('googleapis', () => ({
    google: {
        youtube: jest.fn().mockReturnValue({
            search: {
                list: jest.fn(),
            },
            commentThreads: {
                list: jest.fn(),
            },
        }),
    },
}));

describe('YouTube API Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test to ensure isolation
    });
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
            expect(result.items).toBeUndefined(); 
        });
    });


    //test search a channel
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
            await expect(searchYouTubeChannels('')).rejects.toThrow(); 
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
            await expect(searchYouTubeChannels('A')).rejects.toThrow(); 
        });

        it('should handle network errors gracefully', async () => {
            google.youtube().search.list.mockRejectedValueOnce(new Error('Network Error'));

            await expect(searchYouTubeChannels('network test')).rejects.toThrow('Network Error');
        });

        it('should return an empty array if no channels are found', async () => {
            const mockResponse = { data: { items: [] } };

            google.youtube().search.list.mockResolvedValueOnce(mockResponse);

            const result = await searchYouTubeChannels('noresults');
            expect(result.items).toEqual([]);
        });

        it('should return channel details with correct snippet data', async () => {
            const mockResponse = {
                data: {
                    items: [
                        {
                            id: { channelId: 'C33333' },
                            snippet: {
                                title: 'Channel With Details',
                                description: 'This is a test channel',
                                thumbnails: { default: { url: 'http://thumbnail.url' } }
                            }
                        },
                    ],
                },
            };

            google.youtube().search.list.mockResolvedValueOnce(mockResponse);

            const result = await searchYouTubeChannels('Channel With Details');
            const channel = result.items[0];

            expect(channel.snippet.title).toBe('Channel With Details');
            expect(channel.snippet.description).toBe('This is a test channel');
            expect(channel.snippet.thumbnails.default.url).toBe('http://thumbnail.url');
        });
    });

    describe('getYouTubeComments', () => {
        it('should return comments for a valid videoId', async () => {
            const mockResponse = {
                data: {
                    items: [
                        {
                            snippet: {
                                topLevelComment: {
                                    snippet: {
                                        textDisplay: 'This is a comment',
                                    },
                                },
                            },
                        },
                    ],
                },
            };

            google.youtube().commentThreads.list.mockResolvedValueOnce(mockResponse);

            const result = await getYouTubeComments('mockVideoId');
            expect(result).toEqual(mockResponse.data);
        });

        it('should return an empty array if no comments are found', async () => {
            const mockResponse = { data: { items: [] } };
            google.youtube().commentThreads.list.mockResolvedValueOnce(mockResponse);
    
            const result = await getYouTubeComments('nonexistentVideoId');
            expect(result.items).toHaveLength(0);
        });
    
        it('should throw an error if the YouTube API request fails', async () => {
            google.youtube().commentThreads.list.mockRejectedValueOnce(new Error('API Error'));
    
            await expect(getYouTubeComments('errorVideoId')).rejects.toThrow('API Error');
        });
    
        it('should validate videoId and throw an error if videoId is missing', async () => {
            await expect(getYouTubeComments('')).rejects.toThrow();
        });
    
        it('should call the YouTube API with the correct parameters', async () => {
            const mockResponse = {
                data: {
                    items: [
                        {
                            snippet: {
                                topLevelComment: {
                                    snippet: {
                                        textDisplay: 'Another comment',
                                    },
                                },
                            },
                        },
                    ],
                },
            };
    
            google.youtube().commentThreads.list.mockResolvedValueOnce(mockResponse);
    
            const videoId = 'testVideoId';
            await getYouTubeComments(videoId);
            expect(google.youtube().commentThreads.list).toHaveBeenCalledWith({
                part: 'snippet,replies',
                videoId: videoId,
                maxResults: 5,
            });
        });
    
        it('should handle unexpected response structure gracefully', async () => {
            const mockResponse = {
                data: {
                    // No items key
                },
            };
    
            google.youtube().commentThreads.list.mockResolvedValueOnce(mockResponse);
    
            const result = await getYouTubeComments('unexpectedVideoId');
            expect(result.items).toBeUndefined(); 
        });

        it('should return comments with correct structure when comments exist', async () => {
            const mockResponse = {
                data: {
                    items: [
                        {
                            snippet: {
                                topLevelComment: {
                                    snippet: {
                                        textDisplay: 'This is a valid comment',
                                        authorDisplayName: 'User1',
                                        likeCount: 10,
                                    },
                                },
                            },
                        },
                    ],
                },
            };
    
            google.youtube().commentThreads.list.mockResolvedValueOnce(mockResponse);
    
            const result = await getYouTubeComments('validVideoId');
            expect(result.items[0].snippet.topLevelComment.snippet).toEqual(
                expect.objectContaining({
                    textDisplay: 'This is a valid comment',
                    authorDisplayName: 'User1',
                    likeCount: 10,
                })
            );
        });
    
        it('should handle network errors gracefully', async () => {
            google.youtube().commentThreads.list.mockRejectedValueOnce(new Error('Network Error'));
    
            await expect(getYouTubeComments('networkErrorVideoId')).rejects.toThrow('Network Error');
        });
    
        it('should return an error message for invalid videoId format', async () => {
            const invalidVideoId = 'invalidFormat';
            google.youtube().commentThreads.list.mockRejectedValueOnce(new Error('Invalid video ID'));
    
            await expect(getYouTubeComments(invalidVideoId)).rejects.toThrow('Invalid video ID');
        });
    
        it('should return comments with author details included', async () => {
            const mockResponse = {
                data: {
                    items: [
                        {
                            snippet: {
                                topLevelComment: {
                                    snippet: {
                                        textDisplay: 'Comment with author details',
                                        authorDisplayName: 'AuthorName',
                                        publishedAt: '2024-10-01T00:00:00Z',
                                    },
                                },
                            },
                        },
                    ],
                },
            };
    
            google.youtube().commentThreads.list.mockResolvedValueOnce(mockResponse);
    
            const result = await getYouTubeComments('authorDetailsVideoId');
            expect(result.items[0].snippet.topLevelComment.snippet).toEqual(
                expect.objectContaining({
                    textDisplay: 'Comment with author details',
                    authorDisplayName: 'AuthorName',
                    publishedAt: '2024-10-01T00:00:00Z',
                })
            );
        });
    });
})

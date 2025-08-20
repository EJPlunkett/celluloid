import React, { useState } from 'react';

const SearchTestPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [testHistory, setTestHistory] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: searchQuery.trim(),
          limit: 10
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      setTestResults(data);
      
      // Add to test history with empty notes and relevancy scores
      const newTest = {
        id: Date.now(),
        query: searchQuery.trim(),
        timestamp: new Date().toLocaleString(),
        searchType: data.query_info?.search_type || 'unknown',
        searchTypeCorrect: null, // null = unchecked, true/false = checked
        totalFilms: data.results?.length || 0,
        films: data.results?.map(movie => ({
          id: movie.movie_id,
          title: movie.movie_title,
          year: movie.year,
          depicted_decade: movie.depicted_decade,
          similarity_score: movie.similarity_score,
          relevancyScore: null // 1-5 scale, null = not rated
        })) || [],
        notes: '',
        results: data
      };
      setTestHistory(prev => [newTest, ...prev]);
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestHistory = (testId, updates) => {
    setTestHistory(prev => 
      prev.map(test => 
        test.id === testId ? { ...test, ...updates } : test
      )
    );
  };

  const updateFilmRelevancy = (testId, filmId, relevancyScore) => {
    setTestHistory(prev => 
      prev.map(test => 
        test.id === testId 
          ? {
              ...test,
              films: test.films.map(film => 
                film.id === filmId ? { ...film, relevancyScore } : film
              )
            }
          : test
      )
    );
  };

  const getSearchTypeColor = (type) => {
    switch(type) {
      case 'aesthetic': return '#000';
      case 'thematic': return '#666';
      case 'hybrid': return '#333';
      default: return '#999';
    }
  };

  const ScoreCard = ({ title, score, maxScore }) => (
    <div style={{
      padding: '16px',
      backgroundColor: '#f6f5f3',
      border: '2px solid #000',
      borderRadius: '15px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#000'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#000'
      }}>
        {score}/{maxScore}
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#ccc',
        borderRadius: '4px',
        marginTop: '8px'
      }}>
        <div style={{
          width: `${Math.min((score / maxScore) * 100, 100)}%`,
          height: '8px',
          backgroundColor: '#000',
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }}></div>
      </div>
    </div>
  );

  return (
    <div style={{
      margin: 0,
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f6f5f3',
      fontFamily: 'Arial, sans-serif',
      color: '#000'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            color: '#000'
          }}>
            SEARCH TEST DASHBOARD
          </h1>
          <p style={{
            fontSize: '16px',
            margin: 0,
            color: '#666'
          }}>
            Debug your search functionality and analyze results
          </p>
        </div>

        {/* Search Input */}
        <div style={{
          backgroundColor: '#fff',
          border: '2px solid #000',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000'
              }}>
                Search Query
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., 'cocaine', 'rainy 1970s grit', 'Robert De Niro'"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #000',
                  borderRadius: '15px',
                  outline: 'none',
                  backgroundColor: isLoading ? '#f5f5f5' : '#fff'
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: isLoading ? '#ccc' : '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isLoading ? 'Testing...' : 'Test Search'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            border: '2px solid #f44336',
            borderRadius: '15px',
            padding: '16px',
            marginBottom: '30px',
            color: '#c62828'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <div style={{ display: 'grid', gap: '30px' }}>
            
            {/* GPT Interpretation */}
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                color: '#000'
              }}>
                GPT INTERPRETATION
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                    SEARCH TYPE
                  </label>
                  <div style={{
                    padding: '8px 16px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: '4px'
                  }}>
                    {testResults.query_info?.search_type?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                    CONFIDENCE
                  </label>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {Math.round((testResults.query_info?.confidence || 0) * 100)}%
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                    RESULTS COUNT
                  </label>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {testResults.results?.length || 0}
                  </div>
                </div>
              </div>

              {testResults.query_info?.aesthetic_keywords && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                    AESTHETIC KEYWORDS
                  </label>
                  <div style={{
                    backgroundColor: '#f6f5f3',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    "{testResults.query_info.aesthetic_keywords}"
                  </div>
                </div>
              )}

              {testResults.query_info?.time_filters?.mentioned_decades?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                    TIME FILTERS
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {testResults.query_info.time_filters.mentioned_decades.map((decade, i) => (
                      <span key={i} style={{
                        padding: '4px 12px',
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {decade}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {testResults.query_info?.search_criteria?.recommended_movies?.length > 0 && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                    GPT RECOMMENDED MOVIES
                  </label>
                  <div style={{
                    backgroundColor: '#f6f5f3',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '4px'
                  }}>
                    {testResults.query_info.search_criteria.recommended_movies.map((movie, i) => (
                      <div key={i} style={{ fontSize: '14px', marginBottom: '4px' }}>
                        • {movie.title} ({movie.year})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quality Scoring */}
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                color: '#000'
              }}>
                QUALITY SCORE
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px'
              }}>
                <ScoreCard 
                  title="QUANTITY" 
                  score={Math.min(testResults.results?.length || 0, 10)} 
                  maxScore={10}
                />
                <ScoreCard 
                  title="DECADE MATCH" 
                  score={testResults.query_info?.time_filters?.mentioned_decades?.length > 0 ? 
                    (testResults.results?.filter(movie => 
                      testResults.query_info.time_filters.mentioned_decades.some(decade =>
                        movie.depicted_decade?.includes(decade)
                      )
                    ).length || 0) : (testResults.results?.length || 0)
                  } 
                  maxScore={testResults.results?.length || 1}
                />
                <ScoreCard 
                  title="CONFIDENCE" 
                  score={Math.round((testResults.query_info?.confidence || 0) * 10)} 
                  maxScore={10}
                />
                <ScoreCard 
                  title="SUCCESS" 
                  score={testResults.success ? 1 : 0} 
                  maxScore={1}
                />
              </div>
            </div>

            {/* Notes Section */}
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                color: '#000'
              }}>
                QUICK NOTES FOR CURRENT TEST
              </h2>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Quick observations about this search (detailed notes can be added in the table below)..."
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #000',
                  borderRadius: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'Arial, sans-serif'
                }}
              />
            </div>

            {/* Results Table */}
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                color: '#000'
              }}>
                SEARCH RESULTS ({testResults.results?.length || 0})
              </h2>
              
              {testResults.results && testResults.results.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f6f5f3' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold' }}>#</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold' }}>TITLE</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold' }}>YEAR</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold' }}>DEPICTED DECADE</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold' }}>SIMILARITY</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold' }}>AESTHETIC SUMMARY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.results.map((movie, index) => (
                        <tr key={movie.movie_id} style={{ 
                          backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                        }}>
                          <td style={{ padding: '12px', border: '1px solid #ccc', fontWeight: 'bold' }}>
                            {index + 1}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ccc', fontWeight: 'bold' }}>
                            {movie.movie_title}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                            {movie.year}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              backgroundColor: testResults.query_info?.time_filters?.mentioned_decades?.some(decade =>
                                movie.depicted_decade?.includes(decade)
                              ) ? '#4caf50' : '#ccc',
                              color: testResults.query_info?.time_filters?.mentioned_decades?.some(decade =>
                                movie.depicted_decade?.includes(decade)
                              ) ? '#fff' : '#000'
                            }}>
                              {movie.depicted_decade || 'N/A'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                            {movie.similarity_score ? `${Math.round(movie.similarity_score * 100)}%` : 'N/A'}
                          </td>
                          <td style={{ 
                            padding: '12px', 
                            border: '1px solid #ccc', 
                            maxWidth: '300px',
                            fontSize: '12px',
                            lineHeight: '1.4'
                          }}>
                            {movie.aesthetic_summary}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666',
                  fontSize: '16px'
                }}>
                  No results found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Results History Table */}
        {testHistory.length > 0 && (
          <div style={{
            backgroundColor: '#fff',
            border: '2px solid #000',
            borderRadius: '15px',
            padding: '20px',
            marginTop: '30px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              color: '#000'
            }}>
              TEST RESULTS SESSION
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f6f5f3' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold', minWidth: '120px' }}>SEARCH QUERY</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold', minWidth: '80px' }}>SEARCH TYPE</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ccc', fontWeight: 'bold', minWidth: '60px' }}>CORRECT?</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ccc', fontWeight: 'bold', minWidth: '60px' }}>TOTAL FILMS</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold', minWidth: '300px' }}>FILMS & RELEVANCY</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc', fontWeight: 'bold', minWidth: '200px' }}>NOTES</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ccc', fontWeight: 'bold', minWidth: '60px' }}>TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {testHistory.map((test, testIndex) => (
                    <tr key={test.id} style={{ 
                      backgroundColor: testIndex % 2 === 0 ? '#fff' : '#f9f9f9'
                    }}>
                      {/* Search Query */}
                      <td style={{ padding: '12px', border: '1px solid #ccc', fontWeight: 'bold', verticalAlign: 'top' }}>
                        "{test.query}"
                      </td>
                      
                      {/* Search Type */}
                      <td style={{ padding: '12px', border: '1px solid #ccc', verticalAlign: 'top' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#000',
                          color: '#fff',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {test.searchType.toUpperCase()}
                        </span>
                      </td>
                      
                      {/* Search Type Correct Checkbox */}
                      <td style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center', verticalAlign: 'top' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="checkbox"
                            checked={test.searchTypeCorrect === true}
                            onChange={(e) => {
                              updateTestHistory(test.id, { 
                                searchTypeCorrect: e.target.checked ? true : null 
                              });
                            }}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <span style={{ fontSize: '10px', color: '#666' }}>✓</span>
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                          <input
                            type="checkbox"
                            checked={test.searchTypeCorrect === false}
                            onChange={(e) => {
                              updateTestHistory(test.id, { 
                                searchTypeCorrect: e.target.checked ? false : null 
                              });
                            }}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <span style={{ fontSize: '10px', color: '#666' }}>✗</span>
                        </label>
                      </td>
                      
                      {/* Total Films */}
                      <td style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'top' }}>
                        {test.totalFilms}
                      </td>
                      
                      {/* Films & Relevancy Scores */}
                      <td style={{ padding: '12px', border: '1px solid #ccc', verticalAlign: 'top' }}>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {test.films.map((film, filmIndex) => (
                            <div key={film.id} style={{ 
                              marginBottom: '8px', 
                              padding: '6px',
                              backgroundColor: filmIndex % 2 === 0 ? '#f8f8f8' : '#fff',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                {filmIndex + 1}. {film.title} ({film.year})
                              </div>
                              <div style={{ marginBottom: '4px', color: '#666' }}>
                                Decade: {film.depicted_decade || 'N/A'} | 
                                Similarity: {film.similarity_score ? `${Math.round(film.similarity_score * 100)}%` : 'N/A'}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '10px', color: '#666' }}>Relevancy:</span>
                                {[1, 2, 3, 4, 5].map(score => (
                                  <label key={score} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <input
                                      type="radio"
                                      name={`relevancy-${test.id}-${film.id}`}
                                      checked={film.relevancyScore === score}
                                      onChange={() => updateFilmRelevancy(test.id, film.id, score)}
                                      style={{ transform: 'scale(0.8)' }}
                                    />
                                    <span style={{ fontSize: '10px' }}>{score}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      
                      {/* Notes */}
                      <td style={{ padding: '12px', border: '1px solid #ccc', verticalAlign: 'top' }}>
                        <textarea
                          value={test.notes}
                          onChange={(e) => updateTestHistory(test.id, { notes: e.target.value })}
                          placeholder="Add notes..."
                          style={{
                            width: '100%',
                            height: '80px',
                            padding: '6px',
                            fontSize: '11px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'Arial, sans-serif'
                          }}
                        />
                      </td>
                      
                      {/* Timestamp */}
                      <td style={{ padding: '12px', border: '1px solid #ccc', fontSize: '10px', color: '#666', verticalAlign: 'top' }}>
                        {test.timestamp.split(' ')[1]} {/* Just show time, not date */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Stats */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f6f5f3',
              borderRadius: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              fontSize: '12px'
            }}>
              <div>
                <strong>Total Tests:</strong> {testHistory.length}
              </div>
              <div>
                <strong>Correct Search Types:</strong> {testHistory.filter(t => t.searchTypeCorrect === true).length}
              </div>
              <div>
                <strong>Avg Films per Search:</strong> {testHistory.length > 0 ? Math.round(testHistory.reduce((sum, t) => sum + t.totalFilms, 0) / testHistory.length) : 0}
              </div>
              <div>
                <strong>Avg Relevancy:</strong> {
                  (() => {
                    const allScores = testHistory.flatMap(t => t.films.map(f => f.relevancyScore)).filter(s => s !== null);
                    return allScores.length > 0 ? (allScores.reduce((sum, s) => sum + s, 0) / allScores.length).toFixed(1) : 'N/A';
                  })()
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTestPage;
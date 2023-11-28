// GitHubUserSearch.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GitHubUserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm.trim() !== '' && searchTerm.length > 3) {
            axios.get(`https://api.github.com/search/users?q=${searchTerm}&page=${page}&per_page=10&sort=followers`)
                .then(response => {
                    setUsers(response.data.items);
                    setError(null);
                })
                .catch(error => {
                    console.error('Error fetching data from GitHub API:', error);
                    if (error.response && error.response.status === 403) {
                        setError('Rate limit exceeded. Please try again later.'); // Set rate limit error message
                    } else {
                        setError('An error occurred. Please try again.');
                    }

                    setUsers([]);
                });
        } else {
            setUsers([]);
        }
    }, [searchTerm, page]);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value.trim() === '') {
            setUsers([]);
            setError(null);
        }
    };

    return (
        <div className="container">
            {/* Input Box Component */}
            <input
                type="text"
                placeholder="Enter your name..."
                value={searchTerm}
                onChange={handleInputChange}
                className="input"
            />
            {error && <p className="error">{error}</p>}
            {users.length > 0 &&
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Avatar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.login}</td>
                                <td><img src={user?.avatar_url} alt={user.login} className="avatar" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            {/* PaginatioN Buttons for List */}
            {users.length > 0 &&
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => handlePageChange(page - 1)} className="paginationBtn">
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button disabled={users.length < 10} onClick={() => handlePageChange(page + 1)} className="paginationBtn">
                        Next
                    </button>
                </div>
            }
        </div>
    );
};

export default GitHubUserSearch;

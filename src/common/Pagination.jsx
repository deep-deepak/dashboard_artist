import React, { useState, useEffect, useMemo } from 'react';
import { Pagination } from 'react-bootstrap';

const CommonPagination = ({ data, onPageData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Calculate pagination values
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Memoize the current data to prevent unnecessary recalculations
    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [currentPage, itemsPerPage, data]);

    // Update parent with paginated data
    useEffect(() => {
        onPageData(currentData);
    }, [currentData, onPageData]);

    // Reset to first page when data length changes
    useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePerPageChange = (newPerPage) => {
        setItemsPerPage(newPerPage);
        setCurrentPage(1);
    };

    // Calculate displayed item range
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Calculate visible page numbers
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }, [currentPage, totalPages]);

    if (totalItems === 0) return null;

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
            <div className="mb-3 mb-md-0">
                <span className="me-2">Show</span>
                <select
                    className="form-select form-select-sm d-inline-block w-auto"
                    value={itemsPerPage}
                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="ms-2">entries</span>
            </div>

            <div className="mb-3 mb-md-0 text-muted">
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>

            <Pagination className="mb-0">
                <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                />
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {currentPage > 3 && totalPages > 5 && (
                    <>
                        <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                        {currentPage > 4 && <Pagination.Ellipsis />}
                    </>
                )}

                {pageNumbers.map(number => (
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                ))}

                {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                        {currentPage < totalPages - 3 && <Pagination.Ellipsis />}
                        <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </Pagination.Item>
                    </>
                )}

                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
                <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
};

export default CommonPagination;
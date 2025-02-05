import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Button, Row, Col, Card, Modal, Spinner } from 'react-bootstrap';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import Title from '../common/Title';
import { contactService } from '../service/contactInfo';
import CommonPagination from '../common/Pagination';
import { toast } from 'react-toastify';
import FormWithContact from '../form/FormWithContact';
import FormWithoutContact from '../form/FormWithoutContact';

export default function Donations() {
    const [donationData, setDonationData] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedDonationId, setSelectedDonationId] = useState(null);

    // Memoize the fetch function to prevent recreation on every render
    const fetchDonations = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await contactService.getContact();
            if (result?.data) {
                setDonationData(result.data);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
            toast.error('Failed to fetch donations');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const totalAmount = donationData.reduce((total, item) => total + (Number(item.amount) || 0), 0);

    const prepareChartData = useCallback((donations) => {
        return donations.reduce((acc, donation, index) => {
            const entry = {
                name: index,
                donations: index + 1,
                amount: acc[index - 1]
                    ? acc[index - 1].amount + Number(donation.amount || 0)
                    : Number(donation.amount || 0)
            };
            acc.push(entry);
            return acc;
        }, []);
    }, []);

    const handleEdit = useCallback((donation) => {
        setSelectedDonation(donation);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedDonation(null);
    }, []);

    const handleUpdate = async (formData) => {
        try {
            const response = await contactService.updateContact(formData._id, formData);
            if (response) {
                // Close modal or perform other actions
                setShowModal(false);
                // Refresh the data
                fetchDonations();
                toast.success('Donation updated successfully');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update donation');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this donation?')) return;

        setIsDeleting(true);
        try {
            await contactService.deleteContact(id);
            await fetchDonations(); // Refresh the data after deletion
            toast.success("Deleted successfully");
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete donation');
        } finally {
            setIsDeleting(false);
        }
    };

    const chartData = prepareChartData(donationData);


    const handleShow = async (donation) => {
        try {
            const newShowState = !donation.isShow;
            setSelectedDonation(donation);
            setShow(newShowState);
            setSelectedDonationId((prevId) => (prevId === donation._id ? null : donation._id));

            // Update the database with the new show state
            await contactService.updateContact(donation._id, { isShow: newShowState });

            // Update the local state to reflect the change
            // You'll need to implement this function to update your local state
            updateDonationShowState(donation._id, newShowState);

        } catch (error) {
            toast.error(error?.message || "Something went wrong in hide/show");
        }
    };

    // Add this function to update local state
    const updateDonationShowState = (donationId, newShowState) => {
        setCurrentItems(prevItems =>
            prevItems.map(item =>
                item._id === donationId
                    ? { ...item, isShow: newShowState }
                    : item
            )
        );
    };
    return (
        <Container fluid className="p-3">
            <Title title="Donations" />

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="bg-dark text-white">
                        <Card.Body>
                            <Card.Title className="text-primary">DONATIONS</Card.Title>
                            <h3>{donationData.length || 0}</h3>
                            <div style={{ height: '150px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="name" stroke="#fff" />
                                        <YAxis stroke="#fff" />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="donations"
                                            stroke="#0d6efd"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="bg-dark text-white">
                        <Card.Body>
                            <Card.Title className="text-success">RAISED</Card.Title>
                            <h3>${totalAmount.toLocaleString()}</h3>
                            <div style={{ height: '150px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="name" stroke="#fff" />
                                        <YAxis stroke="#fff" />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#198754"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <Table responsive variant="dark" className="mt-4">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DONOR</th>
                                <th>AMOUNT</th>
                                <th>MESSAGE</th>
                                <th className="text-end">ACTIONS</th>
                                <th className="text-center">TAGS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((donation) => (
                                <tr
                                    key={donation._id}
                                    className={`${donation.isShow ? "" : "selected-row"} ${selectedDonationId === donation._id ? "" : "selected-row"}`}
                                >
                                    <td>{donation._id}</td>
                                    <td>{donation.firstName} {donation.lastName}</td>
                                    <td>${Number(donation.amount).toLocaleString()}</td>
                                    <td>{donation.dedicationMessage}</td>
                                    <td className="text-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEdit(donation)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShow(donation)}
                                        >
                                            {donation.isShow ? "Hide" : "Show"}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(donation._id)}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? <Spinner animation="border" size="sm" /> : "Delete"}
                                        </Button>
                                    </td>
                                    <td className="text-center chip">

                                        {donation.tags}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <CommonPagination
                        data={donationData}
                        onPageData={setCurrentItems}
                    />
                </>
            )}

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Donation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDonation && (
                        <>
                            {selectedDonation.tags === "form_with_contact" ? (

                                <FormWithContact
                                    initialData={selectedDonation}
                                    onSubmit={handleUpdate}
                                    submitButtonText="Update"
                                    isEditMode={true}
                                />
                            ) : (
                                <FormWithoutContact
                                    initialData={selectedDonation}
                                    onSubmit={handleUpdate}
                                    submitButtonText="Update"
                                    isEditMode={true}
                                />
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}
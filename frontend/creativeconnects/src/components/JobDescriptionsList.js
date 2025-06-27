import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/JobDescriptionsList.css';

const JobDescriptionsList = () => {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const listInnerRef = useRef();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/buyer/job-descriptions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobDescriptions(res.data.jobDescriptions);
        setVisibleJobs(res.data.jobDescriptions.slice(0, 1));
      } catch (error) {
        console.error('Failed to fetch job descriptions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = jobDescriptions.filter((job) => {
      const combinedText = (
        job.jobTitle +
        ' ' +
        job.companyName +
        ' ' +
        job.skillsQualifications
      ).toLowerCase();
      return combinedText.includes(term.toLowerCase());
    });
    setVisibleJobs(filtered);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setVisibleJobs(jobDescriptions);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setSearchTerm('');
    setVisibleJobs(jobDescriptions.slice(0, 1));
    listInnerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTop = () => {
    if (listInnerRef.current) {
      listInnerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <p className="loading">Loading job descriptions...</p>;

  return (
    <div className="job-container">
      <h2>My Job Descriptions</h2>

      {showAll && (
        <input
          type="text"
          placeholder="Search jobs by title, company or skills"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      )}

      <div className="scrollable-job-list" ref={listInnerRef}>
        {visibleJobs.length === 0 ? (
          <p className="no-results">No job descriptions found.</p>
        ) : (
          visibleJobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3>{job.jobTitle}</h3>
              <p><strong>Company:</strong> {job.companyName}</p>
              <p><strong>Working Hours:</strong> {job.workingHours}</p>
              <p><strong>Education:</strong> {job.educationalBackground}</p>
              <p><strong>Skills & Qualifications:</strong> {job.skillsQualifications}</p>
              <p><strong>Job Type:</strong> {job.jobType}</p>
              <p><strong>Description:</strong> {job.jobDescription}</p>
              <p className="posted-date">
                Posted on: {new Date(job.datePosted).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="button-bar">
        {!showAll && jobDescriptions.length > 1 && (
          <button className="btn" onClick={handleShowAll}>Show More</button>
        )}
        {showAll && (
          <>
            <button className="btn" onClick={handleScrollTop}>Scroll to Top</button>
            <button className="btn" onClick={handleShowLess}>Show Less</button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionsList;

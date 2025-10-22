import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false); // State for copy feedback

  const BACKEND_URL = "http://localhost:3001";

  const analyzeCode = async () => {
    if (!code.trim()) {
      setError("Please paste some code to review");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setReview(null);

    try {
      console.log("📤 Sending code to backend...");

      const response = await fetch(`${BACKEND_URL}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          language: language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Backend request failed");
      }

      const reviewData = await response.json();
      console.log("✅ Received analysis from backend");

      const formattedReview = {
        issues: reviewData.issues || [],
        originalCode: code,
        fixedCode: reviewData.fixedCode || code,
        summary: reviewData.summary,
      };

      setReview(formattedReview);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(
        err.message || "Failed to analyze code. Make sure backend is running!"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to copy text to clipboard using document.execCommand
  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      } else {
        console.error("Copy command was unsuccessful");
        setError("Failed to copy code.");
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      setError("Failed to copy code.");
    }
    document.body.removeChild(textArea);
  };

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case "critical":
        return "danger";
      case "warning":
        return "warning";
      case "suggestion":
        return "info";
      default:
        return "secondary";
    }
  };

  // Updated to return Bootstrap border classes
  const getIssueClass = (severity) => {
    let baseClass = "issue-card mb-3 shadow-sm border-0"; // Use border-0 and shadow-sm
    switch (severity) {
      case "critical":
        return `${baseClass} border-start border-5 border-danger bg-danger-subtle`; // Added background subtle
      case "warning":
        return `${baseClass} border-start border-5 border-warning bg-warning-subtle`; // Added background subtle
      case "suggestion":
        return `${baseClass} border-start border-5 border-info bg-info-subtle`; // Added background subtle
      default:
        return baseClass + " border"; // Fallback with regular border
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "bug":
        return "🐛"; // Bug
      case "performance":
        return "⚡"; // Performance
      case "security":
        return "🔒"; // Security
      case "style":
        return "🎨"; // Style
      default:
        return "ℹ️"; // Info / Other
    }
  };

  // Icons for summary cards
  const summaryIcons = {
    critical: "bi-x-octagon-fill",
    warnings: "bi-exclamation-triangle-fill",
    suggestions: "bi-lightbulb-fill",
  };


  return (
    // Added bg-light for page background
    <div className="min-vh-100 py-5 bg-light">
      {/* Increased max-width */}
      <Container style={{ maxWidth: "1000px" }}>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
             {/* Icon color changed to primary */}
            <i className="bi bi-code-slash me-3 text-primary"></i>
            AI Code Reviewer
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          // Added shadow-sm and rounded-3
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="shadow-sm rounded-3">
            <Alert.Heading>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Error
            </Alert.Heading>
            <p className="mb-0">{error}</p>
            {error.includes("backend") && (
              <small className="d-block mt-2">
                💡 Make sure your backend server is running on port 3001
              </small>
            )}
          </Alert>
        )}

        {/* Code Input Section */}
        {/* Added rounded-3 */}
        <Card className="shadow-sm mb-4 rounded-3">
          <Card.Body className="p-4">
            <Form>
              <Row className="mb-3">
                <Col md={4} lg={3}> {/* Adjusted column size */}
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-translate me-2"></i> {/* Changed icon */}
                    Language:
                  </Form.Label>
                  <Form.Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                     aria-label="Select code language"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="php">PHP</option>
                    <option value="typescript">TypeScript</option>
                     {/* Add more languages if needed */}
                  </Form.Select>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-file-earmark-code me-2"></i>
                  Your Code:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={15} // Increased rows
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here for AI review..."
                  className="code-textarea font-monospace bg-body-tertiary" // Added font and bg
                   aria-label="Code input area"
                />
              </Form.Group>

              <Button
                variant="primary"
                size="lg"
                onClick={analyzeCode}
                disabled={!code.trim() || isAnalyzing} // Disabled if code is empty/whitespace
                className="w-100 fw-semibold" // Added font weight
              >
                {isAnalyzing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                      aria-hidden="true"
                    />
                    AI is analyzing... {/* Shortened text */}
                  </>
                ) : (
                  <>
                    <i className="bi bi-stars me-2"></i> {/* Changed icon */}
                    Review My Code
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Results Section */}
        {review && (
          <>
            {/* Summary */}
            {/* Added rounded-3 */}
            <Card className="shadow-sm mb-4 rounded-3">
              <Card.Body className="p-4">
                <h2 className="h4 mb-4">
                  <i className="bi bi-clipboard-data-fill me-2"></i> {/* Changed icon */}
                  Review Summary
                </h2>
                <Row>
                  {/* Critical Issues Summary Card */}
                  <Col md={4} className="mb-3 mb-md-0">
                    <div className="summary-card bg-danger-subtle text-danger-emphasis border border-danger-subtle border-start border-5 rounded-3 p-3 text-center h-100">
                     <i className={`${summaryIcons.critical} fs-2 mb-2 d-block`}></i>
                      <div className="display-4 fw-bold">
                        {review.summary.critical}
                      </div>
                      <div className="fw-semibold mt-1 small text-uppercase">
                        Critical Issues
                      </div>
                    </div>
                  </Col>
                   {/* Warnings Summary Card */}
                  <Col md={4} className="mb-3 mb-md-0">
                    <div className="summary-card bg-warning-subtle text-warning-emphasis border border-warning-subtle border-start border-5 rounded-3 p-3 text-center h-100">
                      <i className={`${summaryIcons.warnings} fs-2 mb-2 d-block`}></i>
                      <div className="display-4 fw-bold">
                        {review.summary.warnings}
                      </div>
                      <div className="fw-semibold mt-1 small text-uppercase">Warnings</div>
                    </div>
                  </Col>
                   {/* Suggestions Summary Card */}
                  <Col md={4}>
                    <div className="summary-card bg-info-subtle text-info-emphasis border border-info-subtle border-start border-5 rounded-3 p-3 text-center h-100">
                      <i className={`${summaryIcons.suggestions} fs-2 mb-2 d-block`}></i>
                      <div className="display-4 fw-bold">
                        {review.summary.suggestions}
                      </div>
                      <div className="fw-semibold mt-1 small text-uppercase">Suggestions</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Issues List or Success Message */}
            {review.issues.length > 0 ? (
              // Added rounded-3
              <Card className="shadow-sm mb-4 rounded-3">
                <Card.Body className="p-4">
                  <h2 className="h4 mb-4">
                    <i className="bi bi-list-check me-2"></i> {/* Changed icon */}
                    Issues Found
                  </h2>
                  {review.issues.map((issue, index) => (
                    // Updated className using getIssueClass which now includes bg-subtle
                    <Card
                      key={index}
                      className={`${getIssueClass(issue.severity)} rounded-3`} // Applied function and rounded-3
                    >
                      <Card.Body className="p-3"> {/* Slightly reduced padding */}
                        <Row className="g-0"> {/* Use Row/Col for better alignment */}
                           <Col xs="auto" className="pe-3 fs-4 d-flex align-items-center">
                              {getCategoryIcon(issue.category)}
                          </Col>
                          <Col>
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                              <h5 className="mb-0 me-2 fw-semibold">{issue.title}</h5>
                              <Badge
                                pill // Changed badge style
                                bg="secondary"
                                text="white" // Ensure contrast
                                className="font-monospace small px-2"
                              >
                                Line {issue.line}
                              </Badge>
                              <Badge
                                pill // Changed badge style
                                bg={getSeverityVariant(issue.severity)}
                                className="small px-2 text-uppercase"
                              >
                                {issue.severity}
                              </Badge>
                            </div>

                            <div className="small text-body-secondary"> {/* Used text-body-secondary */}
                              <p className="mb-1"> {/* Reduced margin */}
                                <strong>Problem:</strong> {issue.problem}
                              </p>
                              <p className="mb-1"> {/* Reduced margin */}
                                <strong>Why:</strong> {issue.why}
                              </p>
                              <p className="mb-0">
                                <strong>Fix:</strong> {issue.fix}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
              </Card>
            ) : (
               // Added rounded-3
              <Alert variant="success" className="shadow-sm mb-4 rounded-3">
                <div className="text-center py-4">
                  <i className="bi bi-check2-circle display-1 text-success"></i> {/* Changed icon */}
                  <h3 className="mt-3 mb-2">Great Code!</h3>
                  <p className="mb-0 text-muted"> {/* Added text-muted */}
                    No issues found. Your code looks good!
                  </p>
                </div>
              </Alert>
            )}

            {/* Code Comparison - Only shows if issues exist */}
            {review.issues.length > 0 && (
              // Added rounded-3
              <Card className="shadow-sm mb-4 rounded-3">
                <Card.Body className="p-4">
                  <h2 className="h4 mb-4">
                    <i className="bi bi-git me-2"></i> {/* Changed icon */}
                    Code Comparison
                  </h2>
                  <Row>
                    {/* Original Code */}
                    <Col lg={6} className="mb-3 mb-lg-0">
                      {/* Removed bg-opacity, border, used subtle bg */}
                       <div className="d-flex align-items-center bg-danger-subtle text-danger-emphasis rounded-top p-2">
                        <i className="bi bi-file-earmark-code me-2"></i>
                        <strong className="small text-uppercase">Original Code</strong>
                      </div>
                       {/* Added bg-dark, text-light etc for dark code block */}
                      <div className="code-block rounded-bottom overflow-hidden">
                        <pre className="bg-dark text-light p-3 m-0">
                          <code className="font-monospace small">{review.originalCode}</code>
                        </pre>
                      </div>
                    </Col>
                     {/* Fixed Code */}
                    <Col lg={6}>
                       {/* Header with Copy Button */}
                       <div className="d-flex justify-content-between align-items-center bg-success-subtle text-success-emphasis rounded-top p-2">
                        <div className="small text-uppercase">
                          <i className="bi bi-file-earmark-check me-2"></i>
                          <strong>Fixed Code</strong>
                        </div>
                        <Button
                          variant={isCopied ? "success" : "outline-secondary"}
                          size="sm"
                          onClick={() => copyToClipboard(review.fixedCode)}
                          disabled={isCopied}
                          className="py-0 px-2" // Adjusted padding
                        >
                          <i className={`bi ${isCopied ? 'bi-check-lg' : 'bi-clipboard'} me-1 small`}></i>
                          <span className="small">{isCopied ? "Copied!" : "Copy"}</span>
                        </Button>
                      </div>
                       {/* Dark code block */}
                       <div className="code-block rounded-bottom overflow-hidden">
                        <pre className="bg-dark text-light p-3 m-0">
                          <code className="font-monospace small">{review.fixedCode}</code>
                        </pre>
                      </div>
                    </Col>
                  </Row>
                  {/* Summary Alert */}
                   <Alert variant="secondary" className="mt-3 mb-0 text-center small p-2">
                      <i className="bi bi-info-circle me-1"></i>
                     {`${review.issues.length} issue(s) identified and fixed.`}
                  </Alert>
                </Card.Body>
              </Card>
            )}

            {/* Reset Button */}
            <div className="text-center mt-4"> {/* Added top margin */}
              <Button
                variant="outline-secondary" // Changed variant
                size="lg"
                onClick={() => {
                  setReview(null);
                  setCode("");
                  setError(null); // Also clear error on reset
                  setIsCopied(false); // Reset copy status
                }}
              >
                <i className="bi bi-arrow-repeat me-2"></i> {/* Changed icon */}
                Review New Code
              </Button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!review && !isAnalyzing && (
           // Added rounded-3
          <Card className="shadow-sm rounded-3">
             {/* Increased padding, added bg-body-tertiary */}
            <Card.Body className="p-5 text-center bg-body-tertiary rounded-3">
               {/* Changed icon */}
              <i className="bi bi-card-text display-1 text-muted opacity-50"></i>
              <h3 className="mt-4 mb-2 fw-normal">Ready to Review Your Code</h3> {/* Adjusted font weight */}
              <p className="text-muted mb-0">
                Paste your code, select the language, and click the button above.
              </p>
              <small className="text-muted d-block mt-3"> {/* Added margin */}
                <i className="bi bi-lock-fill me-1"></i> {/* Changed icon */}
                Analysis is processed securely via backend. Your code is not stored.
              </small>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}


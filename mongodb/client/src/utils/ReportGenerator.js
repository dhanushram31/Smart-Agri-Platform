import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate comprehensive PDF report for crop prediction
 * @param {Object} data - Complete prediction data
 * @param {string} data.predictedCrop - Recommended crop
 * @param {number} data.predictedPrice - Expected price
 * @param {Object} data.soilData - Soil parameters (N, P, K, pH, etc.)
 * @param {Object} data.recommendations - Fertilizer and soil recommendations
 * @param {string} data.userName - User's name (optional)
 * @param {string} data.location - Farm location (optional)
 */
export const generateCropPredictionReport = async (data) => {
    try {
        const {
            predictedCrop,
            predictedPrice,
            soilData,
            recommendations,
            userName = 'Farmer',
            location = 'N/A'
        } = data;

        // Initialize jsPDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (2 * margin);
        let yPos = margin;

        // Helper function to check if new page is needed
        const checkPageBreak = (requiredSpace) => {
            if (yPos + requiredSpace > pageHeight - margin) {
                pdf.addPage();
                yPos = margin;
                return true;
            }
            return false;
        };

        // Helper function to add text with wrapping
        const addText = (text, x, y, maxWidth, fontSize = 10, align = 'left') => {
            pdf.setFontSize(fontSize);
            const lines = pdf.splitTextToSize(text, maxWidth);
            pdf.text(lines, x, y, { align });
            return lines.length * (fontSize * 0.5); // Return height used
        };

        // ============================================
        // HEADER SECTION
        // ============================================
        
        // Add header background
        pdf.setFillColor(16, 185, 129); // Green color
        pdf.rect(0, 0, pageWidth, 50, 'F');

        // Add title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CROP PREDICTION REPORT', pageWidth / 2, 20, { align: 'center' });

        // Add subtitle
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Smart Agriculture Platform', pageWidth / 2, 30, { align: 'center' });

        // Add date
        const reportDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        pdf.setFontSize(10);
        pdf.text(`Generated: ${reportDate}`, pageWidth / 2, 40, { align: 'center' });

        yPos = 60;
        pdf.setTextColor(0, 0, 0);

        // ============================================
        // FARM INFORMATION
        // ============================================
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(16, 185, 129);
        pdf.text('Farm Information', margin, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        const farmInfo = [
            { label: 'Farmer Name:', value: userName },
            { label: 'Location:', value: location },
            { label: 'Report Date:', value: reportDate }
        ];

        farmInfo.forEach(info => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(info.label, margin, yPos);
            pdf.setFont('helvetica', 'normal');
            pdf.text(info.value, margin + 35, yPos);
            yPos += 6;
        });

        yPos += 5;

        // ============================================
        // PREDICTION RESULTS
        // ============================================
        
        checkPageBreak(40);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(16, 185, 129);
        pdf.text('Prediction Results', margin, yPos);
        yPos += 10;

        // Result box
        pdf.setFillColor(240, 253, 244); // Light green background
        pdf.setDrawColor(16, 185, 129);
        pdf.roundedRect(margin, yPos, contentWidth, 30, 3, 3, 'FD');

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recommended Crop:', margin + 5, yPos + 10);
        pdf.setFontSize(16);
        pdf.setTextColor(16, 185, 129);
        pdf.text(predictedCrop.toUpperCase(), margin + 5, yPos + 20);

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Expected Price:', pageWidth - margin - 60, yPos + 10);
        pdf.setFontSize(16);
        pdf.setTextColor(16, 185, 129);
        pdf.text(`₹${Math.round(predictedPrice).toLocaleString()}/quintal`, pageWidth - margin - 60, yPos + 20);

        yPos += 40;

        // ============================================
        // SOIL ANALYSIS
        // ============================================
        
        checkPageBreak(60);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(16, 185, 129);
        pdf.text('Soil Analysis', margin, yPos);
        yPos += 10;

        // Soil parameters table
        const soilParams = [
            { param: 'Nitrogen (N)', value: `${soilData.N} mg/kg`, status: getSoilStatus(soilData.N, 'N') },
            { param: 'Phosphorus (P)', value: `${soilData.P} mg/kg`, status: getSoilStatus(soilData.P, 'P') },
            { param: 'Potassium (K)', value: `${soilData.K} mg/kg`, status: getSoilStatus(soilData.K, 'K') },
            { param: 'pH Level', value: soilData.ph.toFixed(1), status: getSoilStatus(soilData.ph, 'ph') }
        ];

        // Table header
        pdf.setFillColor(16, 185, 129);
        pdf.setTextColor(255, 255, 255);
        pdf.rect(margin, yPos, contentWidth, 8, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Parameter', margin + 2, yPos + 5);
        pdf.text('Value', margin + 60, yPos + 5);
        pdf.text('Status', margin + 110, yPos + 5);
        yPos += 8;

        // Table rows
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        soilParams.forEach((item, index) => {
            if (index % 2 === 0) {
                pdf.setFillColor(245, 245, 245);
                pdf.rect(margin, yPos, contentWidth, 7, 'F');
            }
            pdf.text(item.param, margin + 2, yPos + 5);
            pdf.text(item.value, margin + 60, yPos + 5);
            
            // Status with color
            const statusColor = getStatusColor(item.status);
            pdf.setTextColor(statusColor.r, statusColor.g, statusColor.b);
            pdf.setFont('helvetica', 'bold');
            pdf.text(item.status, margin + 110, yPos + 5);
            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'normal');
            
            yPos += 7;
        });

        yPos += 5;

        // ============================================
        // ENVIRONMENTAL CONDITIONS
        // ============================================
        
        checkPageBreak(40);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(16, 185, 129);
        pdf.text('Environmental Conditions', margin, yPos);
        yPos += 10;

        const envParams = [
            { param: 'Temperature', value: `${soilData.temperature}°C` },
            { param: 'Humidity', value: `${soilData.humidity}%` },
            { param: 'Rainfall', value: `${soilData.rainfall} mm` }
        ];

        // Environmental conditions table
        pdf.setFillColor(16, 185, 129);
        pdf.setTextColor(255, 255, 255);
        pdf.rect(margin, yPos, contentWidth, 8, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Parameter', margin + 2, yPos + 5);
        pdf.text('Value', margin + 60, yPos + 5);
        yPos += 8;

        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        envParams.forEach((item, index) => {
            if (index % 2 === 0) {
                pdf.setFillColor(245, 245, 245);
                pdf.rect(margin, yPos, contentWidth, 7, 'F');
            }
            pdf.text(item.param, margin + 2, yPos + 5);
            pdf.text(item.value, margin + 60, yPos + 5);
            yPos += 7;
        });

        yPos += 10;

        // ============================================
        // FERTILIZER RECOMMENDATIONS
        // ============================================
        
        if (recommendations && recommendations.nutrients) {
            checkPageBreak(50);
            
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(16, 185, 129);
            pdf.text('Fertilizer Recommendations', margin, yPos);
            yPos += 10;

            recommendations.nutrients.forEach((nutrient, index) => {
                checkPageBreak(15);
                
                // Nutrient box
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.5);
                pdf.rect(margin, yPos, contentWidth, 12);
                
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(0, 0, 0);
                pdf.text(nutrient.nutrient, margin + 2, yPos + 5);
                
                // Status badge
                const statusColor = getStatusColor(nutrient.status);
                pdf.setFillColor(statusColor.r, statusColor.g, statusColor.b, 0.2);
                pdf.roundedRect(margin + 2, yPos + 7, 20, 4, 1, 1, 'F');
                pdf.setTextColor(statusColor.r, statusColor.g, statusColor.b);
                pdf.setFontSize(8);
                pdf.text(nutrient.status, margin + 4, yPos + 10);
                
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                const recText = pdf.splitTextToSize(nutrient.recommendation, contentWidth - 60);
                pdf.text(recText, margin + 55, yPos + 5);
                
                yPos += 14;
            });

            yPos += 5;
        }

        // ============================================
        // GENERAL ADVICE
        // ============================================
        
        if (recommendations && recommendations.generalAdvice && recommendations.generalAdvice.length > 0) {
            checkPageBreak(50);
            
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(16, 185, 129);
            pdf.text('General Farming Advice', margin, yPos);
            yPos += 10;

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);

            recommendations.generalAdvice.forEach(advice => {
                checkPageBreak(10);
                
                // Bullet point
                pdf.setFont('helvetica', 'bold');
                pdf.text('•', margin + 2, yPos);
                
                pdf.setFont('helvetica', 'normal');
                const adviceLines = pdf.splitTextToSize(advice, contentWidth - 10);
                pdf.text(adviceLines, margin + 7, yPos);
                yPos += adviceLines.length * 4;
            });
        }

        // ============================================
        // FOOTER
        // ============================================
        
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            
            // Footer line
            pdf.setDrawColor(16, 185, 129);
            pdf.setLineWidth(0.5);
            pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
            
            // Footer text
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Smart Agriculture Platform - Crop Prediction Report', margin, pageHeight - 10);
            pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
        }

        // ============================================
        // SAVE PDF
        // ============================================
        
        const fileName = `Crop_Prediction_${predictedCrop}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

        return {
            success: true,
            fileName
        };

    } catch (error) {
        console.error('Error generating PDF:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Helper function to get soil status based on value
 */
const getSoilStatus = (value, type) => {
    switch (type) {
        case 'N':
            if (value < 20) return 'Low';
            if (value < 40) return 'Medium';
            if (value <= 60) return 'Optimal';
            return 'High';
        case 'P':
            if (value < 15) return 'Low';
            if (value < 30) return 'Medium';
            if (value <= 50) return 'Optimal';
            return 'High';
        case 'K':
            if (value < 20) return 'Low';
            if (value < 40) return 'Medium';
            if (value <= 60) return 'Optimal';
            return 'High';
        case 'ph':
            if (value < 6.0) return 'Acidic';
            if (value <= 7.5) return 'Neutral';
            return 'Alkaline';
        default:
            return 'Normal';
    }
};

/**
 * Helper function to get status color
 */
const getStatusColor = (status) => {
    const colors = {
        'Low': { r: 220, g: 38, b: 38 },      // Red
        'Medium': { r: 245, g: 158, b: 11 },  // Orange
        'Optimal': { r: 5, g: 150, b: 105 },  // Green
        'High': { r: 59, g: 130, b: 246 },    // Blue
        'Acidic': { r: 220, g: 38, b: 38 },   // Red
        'Neutral': { r: 5, g: 150, b: 105 },  // Green
        'Alkaline': { r: 245, g: 158, b: 11 } // Orange
    };
    return colors[status] || { r: 0, g: 0, b: 0 };
};

/**
 * Generate PDF report with nutrient gauge charts
 * (Captures visual elements from DOM)
 */
export const generateReportWithCharts = async (data, chartElements) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Generate basic report first
        await generateCropPredictionReport(data);
        
        // If chart elements provided, add them to a new page
        if (chartElements && chartElements.length > 0) {
            pdf.addPage();
            
            let yPos = 20;
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Nutrient Analysis Charts', 20, yPos);
            yPos += 15;
            
            for (const element of chartElements) {
                if (element) {
                    const canvas = await html2canvas(element, {
                        scale: 2,
                        backgroundColor: '#ffffff'
                    });
                    
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 170;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    
                    pdf.addImage(imgData, 'PNG', 20, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 10;
                }
            }
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('Error generating PDF with charts:', error);
        return { success: false, error: error.message };
    }
};

export default generateCropPredictionReport;

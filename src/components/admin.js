import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Container, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../CSS/admin.css';

const CDNURL = "https://hvcusyfentyezvuopvzd.supabase.co/storage/v1/object/public/pdf/";

const AdminPage = () => {
  const [pdfInfos, setPdfInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
    setInitialized(true);
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  useEffect(() => {
    const fetchAllPdfs = async () => {
      try {
        const { data: pdfsData, error: pdfsError } = await supabase
          .from('pdfinfo')
          .select('pdfname, userid, verificate');

        if (pdfsError) {
          throw pdfsError;
        }

        const pdfInfos = [];

        for (const pdf of pdfsData) {
          const { data: userInfo, error: userError } = await supabase
            .from('userinfo')
            .select('name, lastname, career')
            .eq('userid', pdf.userid)
            .single();

          if (userError) {
            console.error('Error fetching user info:', userError);
            continue;
          }

          const { data: certificateInfo, error: certificateError } = await supabase
            .from('certificates')
            .select('val_type')
            .eq('certificate_name', pdf.pdfname)
            .single();

          if (certificateError) {
            console.error('Error fetching certificate info:', certificateError);
            continue;
          }

          pdfInfos.push({
            fileName: pdf.pdfname,
            userId: pdf.userid,
            verificate: pdf.verificate,
            verificationType: certificateInfo.val_type,
            ...userInfo
          });
        }

        setPdfInfos(pdfInfos);
      } catch (error) {
        console.error('Error fetching PDFs and user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPdfs();
  }, []);

  const handleVerify = async (pdf) => {
    try {
      const currentDate = new Date().toISOString();
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;

      const { error } = await supabase
        .from('pdfinfo')
        .update({ verificate: true, time_ver: currentDate, user_ver: userEmail })
        .eq('pdfname', pdf.fileName)
        .eq('userid', pdf.userId);

      if (error) {
        throw error;
      }

      setPdfInfos((prevPdfInfos) =>
        prevPdfInfos.map((p) =>
          p.fileName === pdf.fileName && p.userId === pdf.userId
            ? { ...p, verificate: true }
            : p
        )
      );
    } catch (error) {
      console.error('Error verifying PDF:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const navigateToAdminPanel = () => {
    navigate('/tipovalidacion');
  };

  return (
    <Container align="center" className="container-sm mt-4">
      <h1>Admin Page</h1>
      <Button variant="primary" onClick={navigateToAdminPanel} className="mb-4">
        Go to Admin Panel
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>PDF Name</th>
            <th>User Name</th>
            <th>Career</th>
            <th>Verified</th>
            <th>Verification Type</th>
            <th>Verification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pdfInfos.map((pdf, index) => (
            <tr key={index}>
              <td>{pdf.fileName}</td>
              <td>{`${pdf.name} ${pdf.lastname}`}</td>
              <td>{t(pdf.career)}</td>
              <td>{pdf.verificate ? 'Yes' : 'No'}</td>
              <td>{pdf.verificationType}</td>
              <td>
                {pdf.verificate ? (
                  <span>Verificado</span>
                ) : (
                  pdf.verificationType === 'manual' && (
                    <Button
                      variant="success"
                      onClick={() => handleVerify(pdf)}
                      className="ml-2 custom-button"
                    >
                      Verificar
                    </Button>
                  )
                )}
              </td>
              <td>
                <a
                  href={`${CDNURL}${pdf.userId}/${pdf.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPage;
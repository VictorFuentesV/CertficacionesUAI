import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Container, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

const AdminPanel = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [userCareer, setUserCareer] = useState('');

  useEffect(() => {
    const fetchUserCareer = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (!session.data || !session.data.session) {
          console.error('User not authenticated');
          setLoading(false);
          return;
        }

        const userId = session.data.session.user.id;
        const { data: userInfo, error: userError } = await supabase
          .from('userinfo')
          .select('career')
          .eq('userid', userId)
          .single();

        if (userError) {
          throw userError;
        }

        setUserCareer(userInfo.career);
      } catch (error) {
        console.error('Error fetching user career:', error);
        setLoading(false);
      }
    };

    fetchUserCareer();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        if (!userCareer) return;

        const { data: certificatesData, error: certificatesError } = await supabase
          .from('certificates')
          .select('id, certificate_name, val_type')
          .eq('career', userCareer);

        if (certificatesError) {
          throw certificatesError;
        }

        setCertificates(certificatesData);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userCareer]);

  const handleValTypeChange = async (certId, newValType) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .update({ val_type: newValType })
        .eq('id', certId);

      if (error) {
        throw error;
      }

      setCertificates((prevCertificates) =>
        prevCertificates.map((cert) =>
          cert.id === certId ? { ...cert, val_type: newValType } : cert
        )
      );
    } catch (error) {
      console.error('Error updating validation type:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container align="center" className="container-sm mt-4">
      <h1>Certificados de {t(userCareer)}</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('Certificate Name')}</th>
            <th>{t('Validation Type')}</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id}>
              <td>{cert.certificate_name}</td>
              <td>
                <Form.Select
                  value={cert.val_type}
                  onChange={(e) => handleValTypeChange(cert.id, e.target.value)}
                >
                  <option value="automatico">Automático</option>
                  <option value="manual">Manual</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPanel;
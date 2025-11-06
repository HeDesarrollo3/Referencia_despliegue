// import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
// import { Card, Button, Badge, Alert } from "react-bootstrap";

// interface PlanStepProps {
//   customerAccountId: string;
//   tariffId: string;
//   accounts: any[];
//   onSelect: (accountId: string, tariffId: string) => void;
// }

// export interface PlanStepRef {
//   isValid: () => boolean;
// }

// const PlanStep = forwardRef<PlanStepRef, PlanStepProps>(
//   ({ customerAccountId, tariffId, accounts, onSelect }, ref) => {
//     const [selectedPlan, setSelectedPlan] = useState<{
//       accountId: string;
//       tariffId: string;
//     } | null>(null);
//     const [showError, setShowError] = useState(false);

//     useEffect(() => {
//       if (customerAccountId && tariffId) {
//         setSelectedPlan({ accountId: customerAccountId, tariffId });
//       }
//     }, [customerAccountId, tariffId]);

//     const handleSelect = (accountId: string, tariffId: string) => {
//       setSelectedPlan({ accountId, tariffId });
//       onSelect(accountId, tariffId);
//       setShowError(false); // Oculta el error si se selecciona un plan
//     };

//     // 👇 Exponer función de validación para el componente padre
//     useImperativeHandle(ref, () => ({
//       isValid: () => {
//         if (!selectedPlan) {
//           setShowError(true);
//           return false;
//         }
//         return true;
//       },
//     }));

//     return (
//       <div>
//         <h5>💳 Selección de Plan</h5>

//         {showError && (
//           <Alert variant="danger" className="py-2">
//             ⚠️ Debes seleccionar un plan antes de continuar.
//           </Alert>
//         )}

//         {accounts.length === 0 ? (
//           <p>No hay planes disponibles.</p>
//         ) : (
//           <div className="d-flex flex-wrap gap-3">
//             {accounts.map((account) => {
//               const isSelected =
//                 selectedPlan?.accountId === account.customerAccountId &&
//                 selectedPlan?.tariffId === (account.tariff?.tariffId || "");

//               return (
//                 <Card
//                   key={account.customerAccountId}
//                   className={`shadow-sm ${isSelected ? "border-primary" : ""}`}
//                   style={{
//                     flex: "1 1 250px",
//                     cursor: "pointer",
//                     transition: "0.2s ease-in-out",
//                   }}
//                   onClick={() =>
//                     handleSelect(account.customerAccountId, account.tariff?.tariffId || "")
//                   }
//                 >
//                   <Card.Body>
//                     <Card.Title className="h6 mb-1">{account.name}</Card.Title>
//                     <Card.Text className="small mb-1">
//                       <b>Tarifa:</b> {account.tariff?.name || "—"}
//                     </Card.Text>
//                     {isSelected ? (
//                       <Badge bg="success">Seleccionado</Badge>
//                     ) : (
//                       <Button size="sm" variant="outline-primary">
//                         Seleccionar
//                       </Button>
//                     )}
//                   </Card.Body>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// export default PlanStep;




import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, Button, Badge, Alert, Spinner, Placeholder, Row, Col } from "react-bootstrap";

interface PlanStepProps {
  customerAccountId: string;
  tariffId: string;
  accounts: any[];
  loading: boolean; // Control de carga
  onSelect: (accountId: string, tariffId: string) => void;
}

export interface PlanStepRef {
  isValid: () => boolean;
}

const PlanStep = forwardRef<PlanStepRef, PlanStepProps>(
  ({ customerAccountId, tariffId, accounts, loading, onSelect }, ref) => {
    const [selectedPlan, setSelectedPlan] = useState<{
      accountId: string;
      tariffId: string;
    } | null>(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
      if (customerAccountId && tariffId) {
        setSelectedPlan({ accountId: customerAccountId, tariffId });
      }
    }, [customerAccountId, tariffId]);

    const handleSelect = (accountId: string, tariffId: string) => {
      setSelectedPlan({ accountId, tariffId });
      onSelect(accountId, tariffId);
      setShowError(false);
    };

    useImperativeHandle(ref, () => ({
      isValid: () => {
        if (!selectedPlan) {
          setShowError(true);
          return false;
        }
        return true;
      },
    }));

    // 🔹 Spinner y placeholder profesional
    if (loading) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-2 mb-4">Cargando planes...</p>

          <Row className="g-3 justify-content-center">
            {[1, 2, 3].map((i) => (
              <Col key={i} xs={12} sm={6} md={4}>
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as={Card.Text} animation="glow">
                      <Placeholder xs={4} />
                    </Placeholder>
                    <Placeholder.Button variant="primary" xs={6} />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    return (
      <div>
        <h5>💳 Selección de Plan</h5>

        {showError && (
          <Alert variant="danger" className="py-2">
            ⚠️ Debes seleccionar un plan antes de continuar.
          </Alert>
        )}

        {accounts.length === 0 ? (
          <p>No hay planes disponibles.</p>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            {accounts.map((account) => {
              const isSelected =
                selectedPlan?.accountId === account.customerAccountId &&
                selectedPlan?.tariffId === (account.tariff?.tariffId || "");

              return (
                <Card
                  key={account.customerAccountId}
                  className={`shadow-sm ${isSelected ? "border-primary" : ""}`}
                  style={{
                    flex: "1 1 250px",
                    cursor: "pointer",
                    transition: "0.2s ease-in-out",
                  }}
                  onClick={() =>
                    handleSelect(account.customerAccountId, account.tariff?.tariffId || "")
                  }
                >
                  <Card.Body>
                    <Card.Title className="h6 mb-1">{account.name}</Card.Title>
                    <Card.Text className="small mb-1">
                      <b>Tarifa:</b> {account.tariff?.name || "—"}
                    </Card.Text>
                    {isSelected ? (
                      <Badge bg="success">Seleccionado</Badge>
                    ) : (
                      <Button size="sm" variant="outline-primary">
                        Seleccionar
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

export default PlanStep;

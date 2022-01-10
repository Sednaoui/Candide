import {
    Tab,
    Tabs,
} from '../../components/index';
import Assets from './AssetsList';
import Transactions from './TransactionList';

const WalletNavBar = (): React.ReactElement => (
    <>
        <Tabs defaultActiveKey="assets" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="assets" title="Assets">
                <Assets />
            </Tab>
            <Tab eventKey="transactions" title="Transactions">
                <Transactions />
            </Tab>
        </Tabs>
    </>
);

export default WalletNavBar;

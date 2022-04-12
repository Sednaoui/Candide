import {
    Tab,
    Tabs,
} from '../../components/index';
import Assets from './assets/AssetsList';
import Transactions from './History/TransactionsList';

const WalletNavBar = (): React.ReactElement => (
    <Tabs defaultActiveKey="assets" id="uncontrolled-tab-example">
        <Tab eventKey="assets" title="Assets">
            <Assets />
        </Tab>
        <Tab eventKey="transactions" title="Transactions">
            <Transactions />
        </Tab>
    </Tabs>
);

export default WalletNavBar;

'use client';
import React from 'react';
import HeaderMain from '@/app/HomePage/HeaderMain';
import Footer from '@/app/HomePage/Footer';
import WebSpeciails from '@/app/HomePage/WebSpeciails';
import Navbar from '@/app/components/Navbar/Navbar';

const Page = () => {
  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar/>
      
      <div className="container mx-auto px-12 py-6 text-gray-600">
  <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

  <div className="flex flex-col gap-5">
    {/* Section 1 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">General Information</h2>
      <p className="text-lg">
        Onlineking Price, specifications and terms of offers are subject to change without notice. Onlineking is not responsible for typographical and/or photographical errors. Retail products are accompanied by the original manufacturer warranty. We offer technical support or sales advice on Case to Case Basis, But it&rsquo;s Not a Guaranteed Service and We reserve the right to refuse service to anyone.
      </p>
    </section>

    {/* Section 2 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Price Matching</h2>
      <p className="text-lg">
        Onlineking does not price match competitors but will honour our advertised prices on our website. For your convenience, all of our most current pricing is listed on our website and updated in real-time. Prices are non-negotiable.
      </p>
    </section>

    {/* Section 3 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Goods & Services Tax (GST)</h2>
      <p className="text-lg">
        GST is applicable for all orders processed on Onlineking.in where we have or may have nexus for state tax purposes under applicable laws. Therefore, all orders shipped will be charged applicable sales tax according to your area&apos;s tax rate.
      </p>
    </section>

    {/* Section 4 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Physical Damage Policy</h2>
      <p className="text-lg">
        Physical damage to any product purchased at Onlineking.in will effectively void warranty coverage. Improper installation of CPU fans and/or improper clocking may cause CPUs to chip. CPUs that are chipped, burnt or have bent pins are considered physically damaged and cannot be returned for refund or replacement. Physical damage includes but is not limited to improper handling and/or any other type of damage sustained by irregular usage. Onlineking.in will return any physically damaged CPU back to the customer at the customer&apos;s expense.
      </p>
    </section>

    {/* Section 5 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Processing Time</h2>
      <p className="text-lg">
        You can expect your order to be processed within approximately 24-48 hours, provided the items are in stock and there are no problems with payment verification. Onlineking.in does not guarantee same-day shipping. Orders are not processed on weekends and holidays.
      </p>
    </section>

    {/* Section 6 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Pre-orders</h2>
      <p className="text-lg">
        Click the Pre-order button in the item description and checkout as you normally would. You will be kept up-to-date via our website and through standard Order Status emails to your account.
      </p>
    </section>

    {/* Section 7 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Order Status</h2>
      <p className="text-lg">
        Onlineking.in will keep you informed of your order status via e-mail. All tracking information will be emailed to your ID once your order has shipped. You may also acquire your order status and other live updates by logging in to your account on our website.
      </p>
    </section>

    {/* Section 8 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Out of Stock</h2>
      <p className="text-lg">
        If a product is not in stock, Onlineking.in reserves the right to cancel the order without prior notice. In the event of an out-of-stock product, the full amount will be refunded to the customer.
      </p>
    </section>

    {/* Section 9 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Cancellations by the Customer</h2>
      <p className="text-lg">
        Cancellation notice and the order has not been processed/approved by us, we shall cancel the order and refund the entire amount. On cancellation of an order after it has been processed/approved by Onlineking.in, the cancellation charges will become applicable @ flat rate of 5% of the order value. Onlineking.in has the full right to decide whether an order has been processed or not. The customer agrees not to dispute the decision made by Onlineking.in and accept Onlineking.in&apos;s decision regarding the cancellation. Products once dispatched cannot be returned. Nothing herein will prevent you from returning the product pursuant to rights available to you under applicable law.
      </p>
    </section>

    {/* Section 10 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">RMA Process for Online Customers</h2>
      <p className="text-lg">
        In case the customer has received the product as faulty/DOA, the customer should inform us within 7 Days of receipt of the product. If we receive the intimation for a faulty/DOA product in time, we will arrange for pickup and replacement. In other cases, if the customer is not able to inform us about the faulty/DOA product in time, the customer has to bear To and From charges for replacing the material. The customer can also go to a nearby service centre for the particular vendor. We are always there to help the customer by taking the product back and arranging for its replacement.
      </p>
    </section>

    {/* Section 11 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Fraudulent/Declined Transactions</h2>
      <p className="text-lg">
        Onlineking.in reserves the right to recover the cost of goods, collection charges and lawyers fees from persons using the Site fraudulently. Onlineking.in reserves the right to initiate legal proceedings against such persons for fraudulent use of the Site and any other unlawful acts or acts or omissions in breach of these terms and conditions.
      </p>
    </section>

    {/* Section 12 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Electronic Communications</h2>
      <p className="text-lg">
        When you visit the Site or send emails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by email or by posting notices on the Site. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
      </p>
    </section>

    {/* Section 13 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Product Reviews</h2>
      <p className="text-lg">
        Onlineking.in reads all reviews before posting them and reserves the right to deny any review.
      </p>
      <h3 className="text-xl font-semibold mb-2">Here are some of the things that can cause a review to be denied:</h3>
      <ul>
        <li>Offensive or abusive language.</li>
        <li>Prices and availability can change very quickly on the Onlineking.in Web site, so please leave such information out of your review.</li>
        <li>Hyperlinks/URLs.</li>
        <li>References to other stores/resellers.</li>
        <li>Comments on products that were either physically damaged or misused.</li>
        <li>Replies to existing customer reviews; please do not attempt to initiate discussions here.</li>
        <li>Comparisons to competing brands/products of competing brands.</li>
        <li>Criticism of Onlineking.in&apos;s service or the service of our operations partners.</li>
        <li>References to aftermarket procedures or installation techniques not mentioned specifically in the original product documentation (overclocking, hacked drivers, tweaking/modding, etc.)</li>
        <li>Illegal content.</li>
        <li>Invasions of personal privacy.</li>
        <li>Pornography or obscenity.</li>
        <li>Hate or incitement of violence, threats of harm or safety of a person.</li>
        <li>Graphic violence or other acts resulting in serious injury or death.</li>
      </ul>
      <p><strong>We may change these policies at any time without notice.</strong></p>
    </section>

    {/* Section 14 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Purchase Agreement</h2>
      <p className="text-lg">
        By accepting delivery of any product ordered from Onlineking.in, you (&quot;Customer&quot;) agree to be bound by the terms and conditions listed above. You and Onlineking.in agree that the following terms and conditions are the exclusive terms governing the sales transaction between Customer and Onlineking.in. Any attempt to alter, supplement, modify or amend these terms and conditions by the Customer will be considered a material alteration of this agreement and, therefore, are null and void. In addition, these terms and conditions are subject to change at any time, without prior written notice. Therefore, please check these terms and conditions carefully each time you place an order with or accept delivery of any goods from Onlineking.in.
      </p>
    </section>

    {/* Section 15 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">WARRANTIES: ALL PRODUCTS SOLD WITH MANUFACTURER WARRANTY ONLY.</h2>
      <p className="text-lg">
        <ul>
          <li>Onlineking.in is a distributor only. Products sold by Onlineking.in are not manufactured by Onlineking.in. The products may, however, be covered by each manufacturer&apos;s warranty, service, and support policy (if present). Onlineking.in assigns and passes through to the customer any warranty of the manufacturer, and the customer acknowledges that it shall have recourse only under such warranties and only as against the manufacturer of the products. Onlineking.in makes no representation or express warranty with respect to the product except those stated in this document. Onlineking.in disclaims all other warranties, express or implied, as to any such product, including and without limitation, the implied warranties of merchantability and fitness for a particular purpose, and any implied warranties arising from statute, trade usage, course of dealing, or course of performance.</li>
          <li>All items sold through Onlineking.in are sold in an &quot;as-is&quot; condition i.e., as per the manufacturer&apos;s packaging etc. The quality and performance of the product is dependent on the manufacturer. Should any of these items prove defective, do not function or function improperly in any way following their purchase, Onlineking.in shall get the product repaired/serviced by the manufacturer. The buyer shall bear the cost of shipping the product to Onlineking.in.</li>
          <li>Use of the site is entirely at your own risk. Except as expressly set forth below or in a written warranty that accompanies a product (and then only with respect to such product), Onlineking.in expressly disclaims all representations and warranties of any kind either express or implied (including without limitation, warranties of merchantability, fitness for a particular purpose, accuracy, and availability) regarding the site and any products offered or available through the site and products and information on the site are provided on an &quot;as is-where is&quot; basis. Neither Onlineking.in nor its subsidiaries, affiliates or any of their respective employees, agents, directors, representatives, shareholders, predecessors, successors, or assigns (collectively, &quot;affiliates&quot;) will be liable for any indirect, incidental, special, punitive, or consequential damages whatsoever arising directly or indirectly from use of the site, the information contained on or transmitted from the site or products available or purchased through the site, or transactions conducted at the site, even if Onlineking.in has been advised of the possibility of such damages or losses.</li>
          <li>In no event shall the total liability of Onlineking.in or its affiliates arising directly or indirectly from this site or any products available or purchased through the site exceed the lesser of the amount paid by you to Onlineking.in for the single product at issue. You hereby acknowledge that all the provisions of this section will apply to all use of the site, the information contained on the site, and products available or purchased through the site, and transactions conducted at the site.</li>
        </ul>
      </p>
    </section>

    {/* Section 16 */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Governing Law and Jurisdiction</h2>
      <p className="text-lg">
        This User Agreement shall be construed in accordance with the applicable laws of India. The Courts at Bangalore shall have exclusive jurisdiction in any proceedings arising out of this agreement.
        <br />
        Any dispute or difference either in interpretation or otherwise, of any terms of this User Agreement between the parties hereto, the same shall be referred to an independent arbitrator who will be appointed by Onlineking (Madhu IT Junction) and his decision shall be final and binding on the parties hereto. The above arbitration shall be in accordance with the Arbitration and Conciliation Act, 1996 as amended from time to time. The arbitration shall be held in Bangalore. The High Court of judicature at Bangalore alone shall have the jurisdiction and the Laws of India shall apply.
      </p>
    </section>
  </div>
</div>

      <WebSpeciails />
      <Footer />
    </div>
  );
}

export default Page;

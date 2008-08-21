<?php
# ======================================================================
#   (C) Copyright 2008 by Secure Data Software, Inc.
#   
#  "BOOKKEEP" is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#
#   BOOKKEEP is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with BOOKKEEP; if not, write to the Free Software
#   Foundation, Inc., 51 Franklin St, Fifth Floor,
#   Boston, MA  02110-1301  USA 
#   or visit http://www.gnu.org/licenses/gpl.html
#
# ======================================================================
# This custom file prints out orders
# This is a purely manual report, mostly using direct
# calls to the underlying fpdf library
# ======================================================================
include('fpdf153/fpdf.php');
class x4p_orders extends androX4 {
    function main() {
        # First retrieve all orders 
        if(gpExists('order')) {
            $sWhere = ' WHERE o.recnum_ord = '.SQLFN(gp('order'));
        }
        else {
            $sWhere = ' WHERE o.recnum_op = '.SQLFN(gp('batch'));
        }
        SQL("update orders set _agg='C' $sWhere");
        $orders = SQL_AllRows(
            "SELECT o.*,c.description,c.add1,c.city,c.state,c.zip9
               from orders o
               JOIN customers c ON o.customer = c.customer
               ".$sWhere
        );
        if(count($orders)==0) return;
        
        # Now setup the order
        $rep = new p_orders_fpdf();
        
        # The main loop hits orders
        $rep->setFillColor(218);
        foreach($orders as $order) {
            $rep->pageoff = $rep->pageno();
            $rep->row = $order;
            $rep->addPage('P');
            $ord = $order['recnum_ord'];
            
            # Pull the order lines and services, ordered by date
            $sq="Select null as date,sku as activity,'' as employee
                        ,price,qty::numeric(10,2) as qtydec
                        ,amt_taxable,amt_notax,'' as notes
                   FROM orderlines where recnum_ord = $ord
                UNION ALL
                SELECT date,activity,employee
                       ,price,qtydec
                       ,0.00 as amt_taxable,price_extended as amt_notax,notes
                   FROM orderservices where recnum_ord = $ord
                ORDER BY 1";
            #hprint_r($sq);
            $details = SQL_AllRows($sq);
            #hprint_r($details);
            
            $h = $rep->lineheight;
            foreach($details as $d) {
                $date = is_null($d['date']) ? '' : hdate($d['date']);
                $rep->Cell(70,$h,$date,0,0,'L');
                $rep->Cell(70,$h,$d['activity'],0,0,'L');
                $rep->Cell(70,$h,$d['employee'],0,0,'L');
                $rep->Cell(80,$h,number_format($d['qtydec'],2),0,0,'R');
                $rep->Cell(80,$h,number_format($d['price'],2),0,0,'R');
                $rep->Cell(85,$h,number_format($d['amt_taxable'],2),0,0,'R');
                $rep->Cell(85,$h,number_format($d['amt_notax'],2),0,1,'R');
                
                if($d['notes']<>'') {
                    $rep->Multicell(440,$h,$d['notes'],0,1,'L');
                    $rep->ln();
                }
            }
            
            # Bottom of the page for the end of an invoice
            $rep->SetAutoPageBreak(false);
            $lft = (540+36)-250;
            $top =  (36 + ($h*11) + 460);
            $rep->Rect($lft,$top,250,$h*5);
            $rep->SetXY($lft,$top);
            $rep->Cell(80,$h,'Taxable',1,0,'L',1);
            $rep->Cell(85,$h,''                                     ,1,0,'L');
            $rep->Cell(85,$h,number_format($order['amt_taxable'],2) ,1,0,'R');
            $rep->SetXY($lft,$top + $h);
            $rep->Cell(80,$h,'Tax Rate',1,0,'L',1);
            $rep->Cell(85,$h,number_format($order['pct_tax']*100,3),1,0,'R');
            $rep->Cell(85,$h,  ''                                   ,1,0,'L');            
            $rep->SetXY($lft,$top + ($h*2));
            $rep->Cell(80,$h,'Tax Amount',1,0,'L',1);
            $rep->Cell(85,$h,''                                ,1,0,'R');
            $rep->Cell(85,$h,number_format($order['amt_tax'],2),1,0,'R');
            $rep->SetXY($lft,$top + ($h*3));
            $rep->Cell(80,$h,'Not Taxable',1,0,'L',1);
            $rep->Cell(85,$h,''                                ,1,0,'R');
            $notax = $order['amt_notax'] + $order['amt_services'];
            $rep->Cell(85,$h,number_format($notax,2),1,0,'R');
            $rep->SetXY($lft,$top + ($h*4));
            $rep->Cell(80,$h,'TOTAL',1,0,'L',1);
            $rep->Cell(85,$h,''                                ,1,0,'R');
            $rep->Cell(85,$h,number_format($order['amt_order'],2),1,0,'R');
            $rep->SetAutoPageBreak(true,144);
        }
    
        # Send the output to the browser
        header('Pragma:',true);
        $fileout = 'order-'.$orders[0]['recnum_ord']
            .'-'.$orders[0]['customer'].'.pdf';
        $dispo   = gpExists('d') ? 'D' : 'I';
        $rep->Output($fileout,$dispo);
        exit;
    }
}

class p_orders_fpdf extends fpdf {
    // Two setup routines. First is con
    function p_orders_fpdf() {
        $fontname = 'Arial';
        $fontsize = 10;
        $this->lineheight = 15;
        $linespacing = 1;
        $this->FPDF('p','pt','letter');    
        $this->margin_left = 36;
        $this->margin_top = 36;
        $this->SetMargins($this->margin_left,$this->margin_top);
        $this->SetTextColor(0,0,0);
        $this->SetFont($fontname);
        $this->SetFontSize($fontsize);
        $this->fontname=$fontname;
        $this->fontsize=$fontsize;
        $this->linespacing = $linespacing;
        $this->cpi = 120/$fontsize;
        $this->setAutoPAgeBreak(true,144);
    }
    
    function header() {
        # Our gray fill color
        $this->SetFillColor(218);
        $white= 255;
        $h = $this->lineheight;
        
        # Our address.  
        $this->Rect(36,36 ,252,$h*4 ,'D');  # large box
        $this->SetXY(36,36);
        $this->Cell(252,$h,'REMIT TO',1,1,'L',1);
        $this->cell(0,$h,'Secure Data Software, Inc.',0,1);
        $this->Cell(0,$h,'347 Main Street'  ,0,1);
        $this->Cell(0,$h,'East Setauket, NY 11733');

        # Their address.  Large box and then smaller box
        $this->Rect(36,36 + $h*5 ,252,$h*4 ,'D');  # large box
        $this->SetXY(36,36 + $h*5);
        $this->Cell(252,$h,'SOLD TO',1,1,'L',1);
        $this->cell(0,$h,$this->row['description'],0,1);
        $this->Cell(0,$h,$this->row['add1']       ,0,1);
        $this->Cell(0,$h,$this->row['city'].', '.$this->row['state']
                    .$this->row['zip9']
        );
        
        # Order Information
        $this->setXY(360, 36);
        $this->Cell(108, $h, 'Invoice Number',1,0,'L',1);
        $this->Cell(108, $h, $this->row['recnum_ord'],1,0,'R',0);

        $this->setXY(360, 36 + ($h));
        $this->Cell(108, $h, 'Invoice Date',1,0,'L',1);
        $this->Cell(108, $h, hDate($this->row['ts_ins']),1,0,'R',0);

        $this->setXY(360, 36 + ($h*2));
        $this->Cell(108, $h, 'Terms',1,0,'L',1);
        $this->Cell(108, $h, 'Net 15',1,0,'R',0);

        $this->setXY(360, 36 + ($h*5));
        $this->Cell(108, $h, 'Invoice Amount',1,0,'L',1);
        $this->Cell(108, $h, number_format($this->row['amt_order'],2),1,0,'R',0);
        
        # These are the column headers
        $this->setXY(36, 36 +($h*11));
        $this->Cell(70,$h,'Date',1,0,'L',1);
        $this->Cell(70,$h,'Activity',1,0,'L',1);
        $this->Cell(70,$h,'Employee',1,0,'L',1);
        $this->Cell(80,$h,'Qty/Hrs',1,0,'R',1);
        $this->Cell(80,$h,'Price/Rate',1,0,'R',1);
        $this->Cell(85,$h,'Taxable',1,0,'R',1);
        $this->Cell(85,$h,'Not Taxable',1,0,'R',1);
        
        # This is the main body of the box
        $this->Rect(36, 36+($h*11) ,540,460);
        
        # this is the page number
        $this->SetXY((6.5*72),36+($h*9));
        $this->Cell(72*1.5,$h,'Page '.($this->pageNo()-$this->pageoff),1,0,'L');
        
        # Leave the cursor sitting at line 12
        $this->setXY(36,36+($h*12));
    }
    
}
?>